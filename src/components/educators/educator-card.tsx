import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatSGD } from '@/lib/utils'
import type { EducatorProfile } from '@/types'

interface EducatorCardProps {
  educator: EducatorProfile
}

export function EducatorCard({ educator }: EducatorCardProps) {
  const initials = educator.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="border border-[#e0d9cd] bg-[#F7F1E2] hover:border-[#2a2520] transition-colors group">
      <div className="p-7">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={educator.photo_url ?? undefined} alt={educator.name} />
            <AvatarFallback className="bg-[#ede7d8] text-[#2a2520] font-semibold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-semibold text-[#2a2520] text-[15px]">{educator.name}</h3>
            <p className="text-[12px] text-[#8a7f75] mt-0.5">
              {educator.instruments.slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>

        {/* Love statement */}
        {educator.love_statement && (
          <blockquote
            className="font-[family-name:var(--font-display)] italic font-light text-[#2a2520] text-[15px] leading-snug mb-4 line-clamp-2"
            style={{ letterSpacing: "-0.01em" }}
          >
            &ldquo;{educator.love_statement}&rdquo;
          </blockquote>
        )}

        {/* Bio */}
        <p className="text-[13px] text-[#5a5047] mb-5 line-clamp-2 leading-relaxed">
          {educator.bio}
        </p>

        {/* Styles */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {educator.styles.slice(0, 3).map((style) => (
            <span
              key={style}
              className="text-[11px] tracking-[0.08em] uppercase text-[#5a5047] border border-[#e0d9cd] px-2 py-0.5"
            >
              {style}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between border-t border-[#e0d9cd] pt-5">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[#8a7f75] mb-0.5">From</p>
            <p className="text-[15px] font-semibold text-[#2a2520]">{formatSGD(educator.trial_rate)}</p>
            <p className="text-[11px] text-[#8a7f75]">{formatSGD(educator.hourly_rate)}/hr regular</p>
          </div>
          <Link
            href={`/educators/${educator.slug}`}
            className="text-[11px] tracking-[0.12em] uppercase bg-[#DD573D] text-[#F7F1E2] px-4 py-2.5 hover:bg-[#b8432b] transition-colors"
          >
            View & book
          </Link>
        </div>
      </div>
    </div>
  )
}
