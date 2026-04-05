import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, calculateFees } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { educatorId, startsAt, durationMins = 60, isTrial = false } = body

  if (!educatorId || !startsAt) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Fetch educator
  const { data: educator, error: educatorError } = await supabase
    .from('educator_profiles')
    .select('id, name, stripe_account_id, stripe_onboarded, trial_rate, hourly_rate, user_id')
    .eq('id', educatorId)
    .eq('approved', true)
    .single()

  if (educatorError || !educator) {
    return NextResponse.json({ error: 'Educator not found' }, { status: 404 })
  }

  if (!educator.stripe_onboarded || !educator.stripe_account_id) {
    return NextResponse.json({ error: 'Educator not accepting payments yet' }, { status: 400 })
  }

  // Prevent self-booking
  if (educator.user_id === user.id) {
    return NextResponse.json({ error: 'Cannot book yourself' }, { status: 400 })
  }

  const priceTotal = isTrial ? educator.trial_rate : educator.hourly_rate
  const { platformFee } = calculateFees(priceTotal)

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Create a pending booking record first
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      student_id: user.id,
      educator_id: educatorId,
      starts_at: startsAt,
      duration_mins: durationMins,
      status: 'pending',
      is_trial: isTrial,
      price_total: priceTotal,
      platform_fee: platformFee,
    })
    .select()
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  // Create Stripe Checkout Session with Connect
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'sgd',
          product_data: {
            name: isTrial
              ? `Trial lesson with ${educator.name}`
              : `Music lesson with ${educator.name}`,
            description: `60 min · ${new Date(startsAt).toLocaleString('en-SG', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Singapore',
            })}`,
          },
          unit_amount: priceTotal,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: platformFee,
      transfer_data: {
        destination: educator.stripe_account_id,
      },
    },
    success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/educators/${educatorId}`,
    metadata: {
      booking_id: booking.id,
      student_id: user.id,
      educator_id: educatorId,
    },
  })

  // Update booking with checkout session id
  await supabase
    .from('bookings')
    .update({ stripe_checkout_session_id: session.id })
    .eq('id', booking.id)

  return NextResponse.json({ url: session.url })
}
