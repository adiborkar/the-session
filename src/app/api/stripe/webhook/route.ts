import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const stripe = getStripe()
  const resend = new Resend(process.env.RESEND_API_KEY)

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id

      if (!bookingId) break

      // Confirm booking + store payment intent
      const { data: booking } = await supabase
        .from('bookings')
        .update({
          status: 'confirmed',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', bookingId)
        .select(`
          *,
          educator_profile:educator_profiles(name, user_id),
          student:users!bookings_student_id_fkey(email)
        `)
        .single()

      if (booking) {
        // Send confirmation email to student
        const studentEmail = booking.student?.email
        const educatorName = booking.educator_profile?.name
        const lessonTime = new Date(booking.starts_at).toLocaleString('en-SG', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Asia/Singapore',
        })

        if (studentEmail) {
          await resend.emails.send({
            from: 'The Session <noreply@thesession.sg>',
            to: studentEmail,
            subject: `Your lesson with ${educatorName} is confirmed`,
            html: `
              <p>Hi there,</p>
              <p>Your ${booking.is_trial ? 'trial' : ''} lesson with <strong>${educatorName}</strong> is confirmed.</p>
              <p><strong>When:</strong> ${lessonTime}</p>
              <p><strong>Duration:</strong> ${booking.duration_mins} minutes</p>
              ${booking.location_detail ? `<p><strong>Where:</strong> ${booking.location_detail}</p>` : ''}
              <p>See you there. Make music.</p>
              <p>— The Session</p>
            `.trim(),
          }).catch(console.error) // don't fail the webhook if email fails
        }
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.booking_id

      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId)
          .eq('status', 'pending')
      }
      break
    }

    case 'account.updated': {
      // Educator's Stripe Connect account updated
      const account = event.data.object as Stripe.Account
      const onboarded = account.charges_enabled && account.payouts_enabled

      if (account.id) {
        await supabase
          .from('educator_profiles')
          .update({ stripe_onboarded: onboarded })
          .eq('stripe_account_id', account.id)
      }
      break
    }

    default:
      // Unhandled event type — safe to ignore
      break
  }

  return NextResponse.json({ received: true })
}
