export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { ApproveButton } from './approve-button'
import { format } from 'date-fns'
import type { EducatorProfile } from '@/types'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userData?.role !== 'admin') redirect('/')

  const adminClient = await createAdminClient()

  const { data: pendingEducators } = await adminClient
    .from('educator_profiles')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: true })

  const { data: recentBookings } = await adminClient
    .from('bookings')
    .select('*, educator_profile:educator_profiles(name)')
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: stats } = await adminClient
    .from('bookings')
    .select('price_total, platform_fee, status')

  const totalRevenue = stats
    ?.filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + b.platform_fee, 0) ?? 0

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-8">Admin</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-zinc-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">{pendingEducators?.length ?? 0}</p>
          <p className="text-xs text-zinc-500 mt-1">Pending applications</p>
        </div>
        <div className="border border-zinc-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">
            {stats?.filter((b) => b.status === 'completed').length ?? 0}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Completed bookings</p>
        </div>
        <div className="border border-zinc-100 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold">
            SGD {(totalRevenue / 100).toFixed(0)}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Platform revenue</p>
        </div>
      </div>

      {/* Pending educator applications */}
      <section className="mb-10">
        <h2 className="font-semibold text-lg mb-4">Pending educator applications</h2>
        {!pendingEducators || pendingEducators.length === 0 ? (
          <p className="text-sm text-zinc-400 py-6 border border-dashed border-zinc-200 rounded-xl text-center">
            No pending applications.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingEducators.map((educator: EducatorProfile) => (
              <div key={educator.id} className="border border-zinc-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium">{educator.name}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Applied {format(new Date(educator.created_at), 'd MMM yyyy')}
                    </p>
                  </div>
                  <ApproveButton educatorId={educator.id} />
                </div>
                <blockquote className="text-sm text-zinc-500 italic mb-3 bg-amber-50 p-3 rounded-lg">
                  &ldquo;{educator.love_statement}&rdquo;
                </blockquote>
                <p className="text-sm text-zinc-600 mb-3 line-clamp-3">{educator.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {educator.instruments.map((i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>
                  ))}
                  {educator.styles.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent bookings */}
      <section>
        <h2 className="font-semibold text-lg mb-4">Recent bookings</h2>
        <div className="flex flex-col gap-2">
          {recentBookings?.map((b) => (
            <div key={b.id} className="flex items-center justify-between border border-zinc-100 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-medium">
                  {(b.educator_profile as { name?: string } | null)?.name ?? 'Unknown educator'}
                </p>
                <p className="text-xs text-zinc-400">
                  {format(new Date(b.starts_at), 'EEE d MMM, h:mm a')} · {b.is_trial ? 'Trial' : 'Regular'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">
                  SGD {(b.platform_fee / 100).toFixed(2)} fee
                </p>
                <Badge className={`text-xs mt-1 ${
                  b.status === 'completed' ? 'bg-green-100 text-green-700' :
                  b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  'bg-zinc-100 text-zinc-600'
                }`}>
                  {b.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
