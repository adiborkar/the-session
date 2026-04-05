import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarImage src={educator.photo_url ?? undefined} alt={educator.name} />
            <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-semibold text-base">{educator.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {educator.instruments.slice(0, 3).map((inst) => (
                <Badge key={inst} variant="secondary" className="text-xs">
                  {inst}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {educator.love_statement && (
          <blockquote className="text-sm text-zinc-500 italic mb-4 leading-relaxed line-clamp-2">
            &ldquo;{educator.love_statement}&rdquo;
          </blockquote>
        )}

        <p className="text-sm text-zinc-600 mb-4 line-clamp-2 leading-relaxed">
          {educator.bio}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {educator.styles.slice(0, 3).map((style) => (
            <Badge key={style} variant="outline" className="text-xs text-zinc-500">
              {style}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">From</p>
            <p className="font-semibold text-sm">{formatSGD(educator.trial_rate)} trial</p>
            <p className="text-xs text-zinc-400">{formatSGD(educator.hourly_rate)}/hr after</p>
          </div>
          <Link href={`/educators/${educator.slug}`}>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              View & book
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
