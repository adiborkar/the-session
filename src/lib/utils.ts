import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const INSTRUMENTS = [
  'Guitar', 'Piano', 'Violin', 'Drums', 'Bass', 'Ukulele',
  'Voice / Singing', 'Saxophone', 'Flute', 'Cello', 'Trumpet', 'Other',
]

export const STYLES = [
  'Jazz', 'Pop', 'Rock', 'Classical', 'R&B / Soul', 'Blues',
  'Folk / Acoustic', 'Electronic', 'Musical Theatre', 'Worship',
]

export const AGE_GROUPS = [
  { value: 'kids', label: 'Kids (5–12)' },
  { value: 'teens', label: 'Teens (13–17)' },
  { value: 'adults', label: 'Adults (18+)' },
  { value: 'all-ages', label: 'All ages' },
]

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function formatSGD(cents: number) {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
  }).format(cents / 100)
}
