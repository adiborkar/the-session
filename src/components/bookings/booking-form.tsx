'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatSGD } from '@/lib/utils'
import { format, addDays, startOfDay } from 'date-fns'
import { Loader2 } from 'lucide-react'

interface TimeSlot {
  datetime: Date
  label: string
}

interface Props {
  educatorId: string
  educatorUserId: string
  trialRate: number
  hourlyRate: number
  stripeOnboarded: boolean
}

export function BookingForm({ educatorId, trialRate, hourlyRate, stripeOnboarded }: Props) {
  const [isTrial, setIsTrial] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id } : null)
    })
  }, [supabase])

  useEffect(() => {
    async function loadSlots() {
      setSlotsLoading(true)
      const { data: availabilities } = await supabase
        .from('availabilities')
        .select('*')
        .eq('educator_id', educatorId)

      if (!availabilities || availabilities.length === 0) {
        setAvailableSlots([])
        setSlotsLoading(false)
        return
      }

      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('starts_at, duration_mins')
        .eq('educator_id', educatorId)
        .in('status', ['pending', 'confirmed'])
        .gte('starts_at', new Date().toISOString())

      const bookedTimes = new Set(
        (existingBookings ?? []).map((b: { starts_at: string }) =>
          new Date(b.starts_at).toISOString()
        )
      )

      const slots: TimeSlot[] = []
      const today = startOfDay(new Date())

      for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
        const date = addDays(today, dayOffset + 1)
        const dow = date.getDay()

        const dayAvailability = availabilities.filter(
          (a: { day_of_week: number }) => a.day_of_week === dow
        )

        for (const avail of dayAvailability) {
          const [startH, startM] = avail.start_time.split(':').map(Number)
          const [endH, endM] = avail.end_time.split(':').map(Number)

          let hour = startH
          let minute = startM

          while (hour < endH || (hour === endH && minute < endM)) {
            const slot = new Date(date)
            slot.setHours(hour, minute, 0, 0)

            if (!bookedTimes.has(slot.toISOString())) {
              slots.push({
                datetime: slot,
                label: format(slot, 'EEE d MMM, h:mm a'),
              })
            }

            minute += 60
            if (minute >= 60) {
              hour += Math.floor(minute / 60)
              minute = minute % 60
            }
          }
        }
      }

      setAvailableSlots(slots)
      setSlotsLoading(false)
    }

    loadSlots()
  }, [educatorId, supabase])

  async function handleBook() {
    if (!selectedSlot) return

    if (!user) {
      router.push(`/login?redirectTo=${window.location.pathname}`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          educatorId,
          startsAt: selectedSlot.toISOString(),
          durationMins: 60,
          isTrial,
        }),
      })

      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      console.error(err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!stripeOnboarded) {
    return (
      <p className="text-sm text-zinc-400 text-center py-4">
        This educator is not yet accepting bookings.
      </p>
    )
  }

  const price = isTrial ? trialRate : hourlyRate

  return (
    <div className="flex flex-col gap-4">
      {/* Trial / Regular toggle */}
      <div className="flex rounded-lg border border-zinc-200 overflow-hidden">
        <button
          onClick={() => setIsTrial(true)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            isTrial ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:bg-zinc-50'
          }`}
        >
          Trial · {formatSGD(trialRate)}
        </button>
        <button
          onClick={() => setIsTrial(false)}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            !isTrial ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:bg-zinc-50'
          }`}
        >
          Regular · {formatSGD(hourlyRate)}/hr
        </button>
      </div>

      {/* Slot picker */}
      <div>
        <p className="text-sm font-medium mb-2">Pick a time</p>
        {slotsLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          </div>
        ) : availableSlots.length === 0 ? (
          <p className="text-sm text-zinc-400 py-4 text-center">
            No available slots in the next 2 weeks.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
            {availableSlots.map((slot) => (
              <button
                key={slot.datetime.toISOString()}
                onClick={() => setSelectedSlot(slot.datetime)}
                className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                  selectedSlot?.toISOString() === slot.datetime.toISOString()
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={handleBook}
        disabled={!selectedSlot || loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Redirecting...</>
        ) : (
          `Book for ${formatSGD(price)}`
        )}
      </Button>

      <p className="text-xs text-zinc-400 text-center">
        Secure payment via Stripe · 60-min session
      </p>
    </div>
  )
}
