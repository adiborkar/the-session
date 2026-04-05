'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { DAY_NAMES } from '@/lib/utils'
import { Loader2, Plus, Trash2 } from 'lucide-react'

interface AvailabilitySlot {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
}

export default function AvailabilityPage() {
  const [educatorId, setEducatorId] = useState<string | null>(null)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('educator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!profile) { router.push('/educator/apply'); return }

      setEducatorId(profile.id)

      const { data: avails } = await supabase
        .from('availabilities')
        .select('*')
        .eq('educator_id', profile.id)
        .order('day_of_week')

      setSlots(avails ?? [])
      setLoading(false)
    }
    load()
  }, [supabase, router])

  function addSlot() {
    setSlots([...slots, { day_of_week: 1, start_time: '09:00', end_time: '17:00' }])
  }

  function removeSlot(idx: number) {
    setSlots(slots.filter((_, i) => i !== idx))
  }

  function updateSlot(idx: number, field: keyof AvailabilitySlot, value: string | number) {
    setSlots(slots.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  async function handleSave() {
    if (!educatorId) return
    setError('')
    setSaving(true)

    // Delete all existing and re-insert (simple approach)
    await supabase.from('availabilities').delete().eq('educator_id', educatorId)

    if (slots.length > 0) {
      const { error: insertError } = await supabase
        .from('availabilities')
        .insert(slots.map(({ day_of_week, start_time, end_time }) => ({
          educator_id: educatorId,
          day_of_week,
          start_time,
          end_time,
        })))

      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
    }

    setSaving(false)
    router.push('/educator')
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Manage availability</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Set the days and hours when students can book you. Add one row per time block.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {slots.map((slot, idx) => (
          <div key={idx} className="flex items-end gap-3 p-4 border border-zinc-100 rounded-xl">
            <div className="flex flex-col gap-1 w-28">
              <Label className="text-xs">Day</Label>
              <select
                value={slot.day_of_week}
                onChange={(e) => updateSlot(idx, 'day_of_week', parseInt(e.target.value))}
                className="border border-zinc-200 rounded-md px-2 py-1.5 text-sm"
              >
                {DAY_NAMES.map((d, i) => (
                  <option key={i} value={i}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">From</Label>
              <input
                type="time"
                value={slot.start_time}
                onChange={(e) => updateSlot(idx, 'start_time', e.target.value)}
                className="border border-zinc-200 rounded-md px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs">To</Label>
              <input
                type="time"
                value={slot.end_time}
                onChange={(e) => updateSlot(idx, 'end_time', e.target.value)}
                className="border border-zinc-200 rounded-md px-2 py-1.5 text-sm"
              />
            </div>
            <button
              onClick={() => removeSlot(idx)}
              className="mb-0.5 p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSlot}
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800 mb-8 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add time block
      </button>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      <Button
        onClick={handleSave}
        disabled={saving}
        className="bg-amber-500 hover:bg-amber-600 text-white"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save availability'}
      </Button>
    </div>
  )
}
