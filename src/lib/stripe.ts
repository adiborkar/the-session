import Stripe from 'stripe'

export function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
  })
}

export const PLATFORM_FEE_PERCENT = 20 // 20% commission

export function calculateFees(totalCents: number) {
  const platformFee = Math.round(totalCents * (PLATFORM_FEE_PERCENT / 100))
  const educatorPayout = totalCents - platformFee
  return { platformFee, educatorPayout }
}

export function formatSGD(cents: number) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(cents / 100)
}
