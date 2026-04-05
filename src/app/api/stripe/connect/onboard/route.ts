import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', request.url))

  const { data: profile } = await supabase
    .from('educator_profiles')
    .select('id, stripe_account_id')
    .eq('user_id', user.id)
    .single()

  if (!profile) return NextResponse.redirect(new URL('/educator/apply', request.url))

  let accountId = profile.stripe_account_id
  const stripe = getStripe()

  // Create Stripe Express account if not exists
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'SG',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
    accountId = account.id

    await supabase
      .from('educator_profiles')
      .update({ stripe_account_id: accountId })
      .eq('id', profile.id)
  }

  const origin = new URL(request.url).origin

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/api/stripe/connect/onboard`,
    return_url: `${origin}/api/stripe/connect/return`,
    type: 'account_onboarding',
  })

  return NextResponse.redirect(accountLink.url)
}
