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

  if (profile?.stripe_account_id) {
    const stripe = getStripe()
    const account = await stripe.accounts.retrieve(profile.stripe_account_id)
    const onboarded = account.charges_enabled && account.payouts_enabled

    await supabase
      .from('educator_profiles')
      .update({ stripe_onboarded: onboarded })
      .eq('id', profile.id)
  }

  return NextResponse.redirect(new URL('/educator', request.url))
}
