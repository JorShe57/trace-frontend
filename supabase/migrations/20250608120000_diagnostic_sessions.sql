-- Diagnostic sessions: completed tree walks + optional Claude enrichment
create table if not exists public.diagnostic_sessions (
  id uuid primary key default gen_random_uuid(),
  path jsonb not null,
  unit_id text,
  outcome_id text,
  completed_at timestamptz,
  notes text,
  enrichment jsonb,
  claude_model text,
  prompt_version text,
  created_at timestamptz not null default now()
);

create index if not exists diagnostic_sessions_created_at_idx
  on public.diagnostic_sessions (created_at desc);

create index if not exists diagnostic_sessions_outcome_id_idx
  on public.diagnostic_sessions (outcome_id);

alter table public.diagnostic_sessions enable row level security;

-- No public policies: access via service role in API routes only.
-- Add authenticated read policies when auth is introduced.
