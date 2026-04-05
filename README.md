# The Session

Music teaching platform for Singapore. Connecting students with passionate musician-educators — music for the love of it, not grades.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Supabase** — Postgres, Auth, Storage
- **Stripe + Stripe Connect** — payments + educator payouts
- **Resend** — transactional email
- **Tailwind CSS + shadcn/ui**
- **Vercel** — deployment

## Getting started

### 1. Clone & install

```bash
git clone https://github.com/adityaborkar/the-session
cd the-session
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase/migrations/001_initial.sql` in the SQL editor
3. Create storage buckets: `educator-photos` and `educator-videos` (both public)
4. Set Auth → URL Configuration → Site URL to your app URL

### 3. Set up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Enable Connect: Stripe Dashboard → Connect → Settings
3. Get your API keys from Developers → API keys

### 4. Configure env

```bash
cp .env.local.example .env.local
# Fill in all values
```

### 5. Run locally

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── educators/                  # Browse + profile pages
│   ├── login/ signup/              # Auth
│   ├── student/                    # Student dashboard
│   ├── educator/                   # Educator dashboard + apply + availability
│   ├── admin/                      # Admin: approve educators, view bookings
│   ├── booking/success/            # Post-checkout confirmation
│   └── api/
│       ├── stripe/checkout/        # Create Stripe Checkout session
│       ├── stripe/webhook/         # Handle Stripe events
│       ├── stripe/connect/         # Educator Stripe onboarding
│       └── admin/approve-educator/ # Admin action
├── components/
│   ├── layout/                     # Navbar, Footer
│   ├── educators/                  # EducatorCard
│   └── bookings/                   # BookingForm (slot picker)
├── lib/
│   ├── supabase/                   # client.ts, server.ts
│   ├── stripe.ts
│   └── utils.ts
├── types/index.ts
└── middleware.ts                   # Auth route protection
supabase/migrations/001_initial.sql
```

## Revenue model

- **20% platform fee** on every booking
- Stripe Connect (Express) — educators receive 80% automatically
- Trial lessons: SGD 30 default (adjust per educator)

## Deploy to Vercel

```bash
vercel deploy
```

Add all env vars in Vercel → Settings → Environment Variables.

Set your Stripe webhook endpoint to: `https://your-domain.vercel.app/api/stripe/webhook`
