export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatSGD } from '@/lib/utils'
import Link from 'next/link'
import { format } from 'date-fns'
import type { BookingWithRelations } from '@/types'

export default async function EducatorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/educator')

  const { data: profile } = await supabase
    .from('educator_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Set up your educator profile</h1>
        <p className="text-zinc-500 mb-6 text-sm">
          You need to complete your application before you can start teaching.
        </p>
        <Link href="/educator/apply">
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            Complete application
          </Button>
        </Link>
      </div>
    )
  }

  if (!profile.approved) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-3">Application under review</h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Your profile is being reviewed. We&apos;ll email you once you&apos;re approved — usually within 48 hours.
        </p>
      </div>
    )
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      student:users!bookings_student_id_fkey (email)
    `)
    .eq('educator_id', profile.id)
    .order('starts_at', { ascending: false })

  const upcoming = bookings?.filter((b) =>
    ['pending', 'confirmed'].includes(b.status) && new Date(b.starts_at) > new Date()
  ) ?? []

  const totalEarned = bookings
    ?.filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.price_total - b.platform_fee), 0) ?? 0

  const stripeSetupNeeded = !profile.stripe_onboarded

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {profile.name}</h1>
          <p className="text-zinc-500 text-sm mt-1">Educator dashboard</p>
        </div>
        <Link href="/educator/profile">
          <Button variant="outline" size="sm">Edit profile</Button>
        </Link>
      </div>

      {/* Stripe onboarding prompt */}
      {stripeSetupNeeded && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <h2 className="font-semibold text-amber-800 mb-1">Set up payouts</h2>
          <p className="text-sm text-amber-700 mb-3">
            Connect your Stripe account to start receiving payments from students.
          </p>
          <Link href="/api/stripe/connect/onboard">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              Connect Stripe
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-zinc-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{upcoming.length}</p>
          <p className="text-xs text-zinc-500 mt-1">Upcoming lessons</p>
        </div>
        <div className="border border-zinc-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">
            {bookings?.filter((b) => b.status === 'completed').length ?? 0}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Completed</p>
        </div>
        <div className="border border-zinc-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{formatSGD(totalEarned)}</p>
          <p className="text-xs text-zinc-500 mt-1">Total earned</p>
        </div>
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Upcoming sessions</h2>
          <Link href="/educator/availability">
            <Button variant="outline" size="sm">Manage availability</Button>
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm text-zinc-400 py-6 text-center border border-dashed border-zinc-200 rounded-xl">
            No upcoming sessions. Students can book once you set your availability.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((b: BookingWithRelations) => (
              <EducatorBookingRow key={b.id} booking={b} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EducatorBookingRow({ booking }: { booking: BookingWithRelations }) {
  return (
    <div className="flex items-center justify-between border border-zinc-100 rounded-xl p-4">
      <div>
        <p className="font-medium text-sm">{booking.student?.email ?? 'Student'}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {format(new Date(booking.starts_at), 'EEE d MMM yyyy, h:mm a')} ·{' '}
          {booking.duration_mins} min ·{' '}
          {booking.is_trial ? 'Trial' : 'Regular'}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">
          {formatSGD(booking.price_total - booking.platform_fee)}
        </p>
        <p className="text-xs text-zinc-400">your payout</p>
        <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
          {booking.status}
        </Badge>
      </div>
    </div>
  )
}
