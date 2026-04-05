export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatSGD } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import type { BookingWithRelations } from '@/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-zinc-100 text-zinc-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default async function StudentDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirectTo=/student')

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      educator_profile:educator_profiles (
        name, photo_url, slug, instruments
      )
    `)
    .eq('student_id', user.id)
    .order('starts_at', { ascending: false })

  const upcoming = bookings?.filter((b) =>
    ['pending', 'confirmed'].includes(b.status) && new Date(b.starts_at) > new Date()
  ) ?? []

  const past = bookings?.filter((b) =>
    b.status === 'completed' || new Date(b.starts_at) < new Date()
  ) ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">My Lessons</h1>

      <section className="mb-10">
        <h2 className="font-semibold text-lg mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <div className="border border-dashed border-zinc-200 rounded-xl p-10 text-center">
            <p className="text-zinc-400 mb-4 text-sm">No upcoming lessons booked.</p>
            <Link href="/educators">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                Find an educator
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((b: BookingWithRelations) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-4">Past lessons</h2>
          <div className="flex flex-col gap-3">
            {past.map((b: BookingWithRelations) => (
              <BookingRow key={b.id} booking={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function BookingRow({ booking }: { booking: BookingWithRelations }) {
  const educator = booking.educator_profile
  return (
    <div className="flex items-center justify-between border border-zinc-100 rounded-xl p-4">
      <div>
        <p className="font-medium text-sm">{educator?.name ?? 'Educator'}</p>
        <p className="text-xs text-zinc-500 mt-0.5">
          {format(new Date(booking.starts_at), 'EEE d MMM yyyy, h:mm a')} ·{' '}
          {booking.duration_mins} min ·{' '}
          {booking.is_trial ? 'Trial' : 'Regular'}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">{formatSGD(booking.price_total)}</p>
      </div>
      <Badge className={STATUS_COLORS[booking.status] ?? ''}>
        {booking.status}
      </Badge>
    </div>
  )
}
