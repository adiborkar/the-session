'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { INSTRUMENTS, STYLES, AGE_GROUPS, slugify } from '@/lib/utils'
import { Loader2, X } from 'lucide-react'

export default function EducatorApplyPage() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loveStatement, setLoveStatement] = useState('')
  const [hourlyRate, setHourlyRate] = useState('80')
  const [trialRate, setTrialRate] = useState('30')
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (selectedInstruments.length === 0) {
      setError('Please select at least one instrument.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login?redirectTo=/educator/apply')
      return
    }

    const slug = slugify(name) + '-' + Math.random().toString(36).slice(2, 6)

    const { error: insertError } = await supabase
      .from('educator_profiles')
      .insert({
        user_id: user.id,
        name,
        slug,
        bio,
        love_statement: loveStatement,
        instruments: selectedInstruments,
        styles: selectedStyles,
        age_groups: selectedAgeGroups,
        hourly_rate: Math.round(parseFloat(hourlyRate) * 100),
        trial_rate: Math.round(parseFloat(trialRate) * 100),
        approved: false,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/educator')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Apply to teach on The Session</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Tell us about yourself. We&apos;ll review your application and get back to you within 48 hours.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="love">Why do you love music?</Label>
          <p className="text-xs text-zinc-400">This is featured prominently on your profile — be authentic.</p>
          <Textarea
            id="love"
            required
            rows={3}
            value={loveStatement}
            onChange={(e) => setLoveStatement(e.target.value)}
            placeholder="Music gave me a way to express what words couldn't..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            required
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell students about your background, experience, and teaching approach..."
          />
        </div>

        {/* Instruments */}
        <div className="flex flex-col gap-2">
          <Label>Instruments you teach</Label>
          <div className="flex flex-wrap gap-2">
            {INSTRUMENTS.map((inst) => (
              <button
                key={inst}
                type="button"
                onClick={() => setSelectedInstruments(toggle(selectedInstruments, inst))}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedInstruments.includes(inst)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                }`}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* Styles */}
        <div className="flex flex-col gap-2">
          <Label>Musical styles</Label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyles(toggle(selectedStyles, style))}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedStyles.includes(style)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Age groups */}
        <div className="flex flex-col gap-2">
          <Label>Age groups you teach</Label>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.value}
                type="button"
                onClick={() => setSelectedAgeGroups(toggle(selectedAgeGroups, ag.value))}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selectedAgeGroups.includes(ag.value)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                }`}
              >
                {ag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hourlyRate">Hourly rate (SGD)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="20"
              max="500"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="trialRate">Trial lesson rate (SGD)</Label>
            <Input
              id="trialRate"
              type="number"
              min="10"
              max="200"
              value={trialRate}
              onChange={(e) => setTrialRate(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-zinc-400 -mt-4">
          The Session takes a 20% platform fee. Students see the full price; you receive 80%.
        </p>

        {/* Selected summary */}
        {selectedInstruments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedInstruments.map((i) => (
              <Badge key={i} variant="secondary" className="gap-1">
                {i}
                <button type="button" onClick={() => setSelectedInstruments(toggle(selectedInstruments, i))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit application'}
        </Button>
      </form>
    </div>
  )
}
