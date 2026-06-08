-- ─────────────────────────────────────────────────────────────────────────
-- Auth, profiles, and the project-tracker hierarchy.
--
-- Turns T.R.A.C.E. from an anonymous single-player tool into a multi-tech
-- field platform: every technician signs in and owns their own customers,
-- sites, equipment, jobs and saved diagnostic reports. Access is enforced
-- with row-level security keyed on auth.uid(), so the service-role key is no
-- longer the only thing standing between a user and everyone else's data.
--
--   profiles            1:1 with auth.users (display name, company, role)
--   customers           a company/person the tech services
--     └─ sites          a physical location for a customer
--         └─ equipment  a serviceable unit at a site (RTU-3, etc.)
--   jobs                a work order, optionally tied to site/equipment
--   diagnostic_sessions gains user_id / equipment_id / job_id + a title
-- ─────────────────────────────────────────────────────────────────────────

-- ── updated_at helper ────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  company text,
  -- 'tech' | 'lead' | 'admin' — informational for now, room to grow into roles
  role text not null default 'tech',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: owner can read"
  on public.profiles for select using (auth.uid() = id);
create policy "profiles: owner can insert"
  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles: owner can update"
  on public.profiles for update using (auth.uid() = id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, company)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'company'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── customers ────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  contact_name text,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists customers_user_id_idx on public.customers (user_id);

alter table public.customers enable row level security;

create policy "customers: owner full access"
  on public.customers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger customers_set_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- ── sites ────────────────────────────────────────────────────────────────
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sites_user_id_idx on public.sites (user_id);
create index if not exists sites_customer_id_idx on public.sites (customer_id);

alter table public.sites enable row level security;

create policy "sites: owner full access"
  on public.sites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger sites_set_updated_at
  before update on public.sites
  for each row execute function public.set_updated_at();

-- ── equipment ────────────────────────────────────────────────────────────
create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  site_id uuid not null references public.sites (id) on delete cascade,
  -- mirrors the diagnostic tree's unit ids (split-ac, rtu, heat-pump, …)
  unit_type text,
  label text not null,
  manufacturer text,
  model text,
  serial text,
  install_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists equipment_user_id_idx on public.equipment (user_id);
create index if not exists equipment_site_id_idx on public.equipment (site_id);

alter table public.equipment enable row level security;

create policy "equipment: owner full access"
  on public.equipment for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger equipment_set_updated_at
  before update on public.equipment
  for each row execute function public.set_updated_at();

-- ── jobs (work orders) ───────────────────────────────────────────────────
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  site_id uuid references public.sites (id) on delete set null,
  equipment_id uuid references public.equipment (id) on delete set null,
  title text not null,
  description text,
  -- 'open' | 'in_progress' | 'on_hold' | 'done' | 'cancelled'
  status text not null default 'open',
  -- 'low' | 'normal' | 'high' | 'urgent'
  priority text not null default 'normal',
  scheduled_for timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_user_id_idx on public.jobs (user_id);
create index if not exists jobs_status_idx on public.jobs (status);
create index if not exists jobs_scheduled_for_idx on public.jobs (scheduled_for);

alter table public.jobs enable row level security;

create policy "jobs: owner full access"
  on public.jobs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create trigger jobs_set_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- ── diagnostic_sessions: tie reports to a user / equipment / job ─────────
alter table public.diagnostic_sessions
  add column if not exists user_id uuid references auth.users (id) on delete cascade,
  add column if not exists equipment_id uuid references public.equipment (id) on delete set null,
  add column if not exists job_id uuid references public.jobs (id) on delete set null,
  add column if not exists title text;

create index if not exists diagnostic_sessions_user_id_idx
  on public.diagnostic_sessions (user_id);

-- Authenticated technicians may read and manage only their own reports.
-- (The service-role key still bypasses RLS for any anonymous/legacy writes.)
create policy "sessions: owner can read"
  on public.diagnostic_sessions for select
  using (auth.uid() = user_id);
create policy "sessions: owner can insert"
  on public.diagnostic_sessions for insert
  with check (auth.uid() = user_id);
create policy "sessions: owner can update"
  on public.diagnostic_sessions for update
  using (auth.uid() = user_id);
create policy "sessions: owner can delete"
  on public.diagnostic_sessions for delete
  using (auth.uid() = user_id);
