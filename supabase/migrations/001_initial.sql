-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
-- USERS (mirrors auth.users, extended with role)
-- ─────────────────────────────────────────────
create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'student' check (role in ('student', 'educator', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can read own record"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own record"
  on public.users for update
  using (auth.uid() = id);

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────
-- EDUCATOR PROFILES
-- ─────────────────────────────────────────────
create table public.educator_profiles (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references public.users(id) on delete cascade,
  name               text not null,
  slug               text not null unique,
  bio                text not null default '',
  love_statement     text not null default '', -- "What do you love about music?"
  instruments        text[] not null default '{}',
  styles             text[] not null default '{}',
  age_groups         text[] not null default '{}',
  hourly_rate        integer not null default 8000, -- SGD cents (SGD 80)
  trial_rate         integer not null default 3000, -- SGD cents (SGD 30)
  photo_url          text,
  intro_video_url    text,
  stripe_account_id  text,
  stripe_onboarded   boolean not null default false,
  approved           boolean not null default false,
  created_at         timestamptz not null default now()
);

alter table public.educator_profiles enable row level security;

create policy "Anyone can read approved educator profiles"
  on public.educator_profiles for select
  using (approved = true);

create policy "Educators can read own profile"
  on public.educator_profiles for select
  using (auth.uid() = user_id);

create policy "Educators can update own profile"
  on public.educator_profiles for update
  using (auth.uid() = user_id);

create policy "Educators can insert own profile"
  on public.educator_profiles for insert
  with check (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- AVAILABILITY
-- ─────────────────────────────────────────────
create table public.availabilities (
  id           uuid primary key default uuid_generate_v4(),
  educator_id  uuid not null references public.educator_profiles(id) on delete cascade,
  day_of_week  integer not null check (day_of_week between 0 and 6), -- 0=Sun
  start_time   time not null,
  end_time     time not null,
  constraint valid_time_range check (end_time > start_time)
);

alter table public.availabilities enable row level security;

create policy "Anyone can read availabilities"
  on public.availabilities for select
  using (true);

create policy "Educators can manage own availability"
  on public.availabilities for all
  using (
    auth.uid() = (
      select user_id from public.educator_profiles where id = educator_id
    )
  );


-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
create table public.bookings (
  id                          uuid primary key default uuid_generate_v4(),
  student_id                  uuid not null references public.users(id),
  educator_id                 uuid not null references public.educator_profiles(id),
  starts_at                   timestamptz not null,
  duration_mins               integer not null default 60,
  status                      text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  is_trial                    boolean not null default false,
  price_total                 integer not null, -- SGD cents
  platform_fee                integer not null, -- SGD cents
  stripe_payment_intent_id    text,
  stripe_checkout_session_id  text unique,
  location_type               text not null default 'online'
    check (location_type in ('online', 'in-person')),
  location_detail             text,
  notes                       text,
  created_at                  timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Students can read own bookings"
  on public.bookings for select
  using (auth.uid() = student_id);

create policy "Educators can read own bookings"
  on public.bookings for select
  using (
    auth.uid() = (
      select user_id from public.educator_profiles where id = educator_id
    )
  );

create policy "Students can insert bookings"
  on public.bookings for insert
  with check (auth.uid() = student_id);

create policy "Students can cancel own pending bookings"
  on public.bookings for update
  using (auth.uid() = student_id and status = 'pending');


-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
create table public.reviews (
  id           uuid primary key default uuid_generate_v4(),
  booking_id   uuid not null unique references public.bookings(id),
  student_id   uuid not null references public.users(id),
  educator_id  uuid not null references public.educator_profiles(id),
  rating       integer not null check (rating between 1 and 5),
  body         text not null default '',
  created_at   timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select
  using (true);

create policy "Students can insert reviews for completed bookings"
  on public.reviews for insert
  with check (
    auth.uid() = student_id
    and exists (
      select 1 from public.bookings
      where id = booking_id and status = 'completed' and student_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────
-- ADMIN: service role bypasses RLS
-- ─────────────────────────────────────────────
-- Admins use the service role key server-side, so no RLS policies needed for admin actions.

-- ─────────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────────
-- Run in Supabase dashboard or via CLI:
-- supabase storage create educator-photos --public
-- supabase storage create educator-videos --public
