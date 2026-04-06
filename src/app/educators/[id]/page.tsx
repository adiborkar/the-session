export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookingForm } from '@/components/bookings/booking-form'
import { formatSGD } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { EducatorProfile, Review } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EducatorProfilePage({ params }: PageProps) {
  const { id } = await params

  let educator: EducatorProfile | null = null
  let reviews: Review[] | null = null

  try {
    const supabase = await createClient()

    const { data: educatorData } = await supabase
      .from('educator_profiles')
      .select('*')
      .eq('slug', id)
      .eq('approved', true)
      .single()

    educator = educatorData

    if (educator) {
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('educator_id', educator.id)
        .order('created_at', { ascending: false })
        .limit(10)
      reviews = reviewData
    }
  } catch {
    // Supabase not configured
  }

  if (!educator) notFound()

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : null

  const initials = educator.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left: profile */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarImage src={educator.photo_url ?? undefined} alt={educator.name} />
              <AvatarFallback className="bg-amber-100 text-amber-700 text-xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{educator.name}</h1>
              <div className="flex flex-wrap gap-1 mt-2">
                {educator.instruments.map((inst: string) => (
                  <Badge key={inst} variant="secondary">{inst}</Badge>
                ))}
              </div>
              {avgRating && (
                <div className="flex items-center gap-1 mt-2 text-sm text-zinc-500">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{avgRating.toFixed(1)}</span>
                  <span>({reviews?.length} review{reviews?.length !== 1 ? 's' : ''})</span>
                </div>
              )}
            </div>
          </div>

          {/* What they love */}
          {educator.love_statement && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
                Why I love music
              </p>
              <blockquote className="text-zinc-700 leading-relaxed italic">
                &ldquo;{educator.love_statement}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Bio */}
          <div>
            <h2 className="font-semibold mb-3">About</h2>
            <p className="text-zinc-600 leading-relaxed whitespace-pre-line">{educator.bio}</p>
          </div>

          {/* Styles */}
          {educator.styles.length > 0 && (
            <div>
              <h2 className="font-semibold mb-3">Styles</h2>
              <div className="flex flex-wrap gap-2">
                {educator.styles.map((style: string) => (
                  <Badge key={style} variant="outline">{style}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Age groups */}
          {educator.age_groups.length > 0 && (
            <div>
              <h2 className="font-semibold mb-3">Teaches</h2>
              <div className="flex flex-wrap gap-2">
                {educator.age_groups.map((ag: string) => (
                  <Badge key={ag} variant="outline">{ag}</Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Reviews */}
          <div>
            <h2 className="font-semibold mb-4">
              Reviews {reviews && reviews.length > 0 && `(${reviews.length})`}
            </h2>
            {reviews && reviews.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviews.map((review: Review) => (
                  <div key={review.id} className="border border-zinc-100 rounded-xl p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">{review.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No reviews yet — be the first.</p>
            )}
          </div>
        </div>

        {/* Right: booking widget */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="border border-zinc-200 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-2xl font-bold">{formatSGD(educator.trial_rate)}</p>
                <p className="text-sm text-zinc-500">trial lesson · 60 min</p>
                <p className="text-sm text-zinc-400 mt-1">
                  {formatSGD(educator.hourly_rate)}/hr for regular lessons
                </p>
              </div>
              <Separator className="mb-4" />
              <BookingForm
                educatorId={educator.id}
                educatorUserId={educator.user_id}
                trialRate={educator.trial_rate}
                hourlyRate={educator.hourly_rate}
                stripeOnboarded={educator.stripe_onboarded}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
