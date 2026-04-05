export type UserRole = 'student' | 'educator' | 'admin'

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface EducatorProfile {
  id: string
  user_id: string
  name: string
  bio: string
  love_statement: string // "What do you love about music?"
  instruments: string[]
  styles: string[]
  age_groups: AgeGroup[]
  hourly_rate: number // in SGD cents
  trial_rate: number // in SGD cents
  photo_url: string | null
  intro_video_url: string | null
  stripe_account_id: string | null
  stripe_onboarded: boolean
  approved: boolean
  slug: string
  created_at: string
}

export type AgeGroup = 'kids' | 'teens' | 'adults' | 'all-ages'

export interface Availability {
  id: string
  educator_id: string
  day_of_week: number // 0 = Sunday, 6 = Saturday
  start_time: string // HH:MM
  end_time: string   // HH:MM
}

export interface Booking {
  id: string
  student_id: string
  educator_id: string
  starts_at: string // ISO datetime
  duration_mins: number
  status: BookingStatus
  is_trial: boolean
  price_total: number // SGD cents
  platform_fee: number // SGD cents
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  location_type: 'online' | 'in-person'
  location_detail: string | null // zoom link or address
  notes: string | null
  created_at: string
}

export interface BookingWithRelations extends Booking {
  educator_profile: Pick<EducatorProfile, 'name' | 'photo_url' | 'slug' | 'instruments'>
  student: Pick<User, 'email'>
}

export interface Review {
  id: string
  booking_id: string
  student_id: string
  educator_id: string
  rating: number // 1–5
  body: string
  created_at: string
}
