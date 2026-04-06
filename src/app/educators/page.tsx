export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { EducatorCard } from '@/components/educators/educator-card'
import { INSTRUMENTS, STYLES } from '@/lib/utils'
import type { EducatorProfile } from '@/types'

interface PageProps {
  searchParams: Promise<{ instrument?: string; style?: string }>
}

export default async function EducatorsPage({ searchParams }: PageProps) {
  const { instrument, style } = await searchParams

  let educators: EducatorProfile[] | null = null
  try {
    const supabase = await createClient()
    let query = supabase
      .from('educator_profiles')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (instrument) query = query.contains('instruments', [instrument])
    if (style) query = query.contains('styles', [style])

    const { data } = await query
    educators = data
  } catch {
    // Supabase not configured yet
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Find your educator</h1>
        <p className="text-zinc-500">
          {educators?.length ?? 0} educator{educators?.length !== 1 ? 's' : ''} available in Singapore
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        <FilterPills
          label="Instrument"
          options={INSTRUMENTS}
          current={instrument}
          param="instrument"
        />
        <FilterPills
          label="Style"
          options={STYLES}
          current={style}
          param="style"
        />
      </div>

      {educators && educators.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {educators.map((educator: EducatorProfile) => (
            <EducatorCard key={educator.id} educator={educator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-zinc-400">
          <p className="text-lg mb-2">No educators found</p>
          <p className="text-sm">Try removing some filters</p>
        </div>
      )}
    </div>
  )
}

function FilterPills({
  label,
  options,
  current,
  param,
}: {
  label: string
  options: string[]
  current?: string
  param: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}:</span>
      {options.map((opt) => {
        const isActive = current === opt
        const href = isActive ? '/educators' : `/educators?${param}=${encodeURIComponent(opt)}`
        return (
          <a
            key={opt}
            href={href}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              isActive
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
            }`}
          >
            {opt}
          </a>
        )
      })}
    </div>
  )
}
