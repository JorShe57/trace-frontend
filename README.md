# T.R.A.C.E. — Field Diagnostics & Project Tracker

A guided HVAC/R field diagnostic tool **and** a lightweight project tracker,
built as a **Next.js 16 (App Router) + TypeScript + Tailwind** front end backed
by **Supabase** (auth + Postgres + RLS).

Two halves, one app:

- **Public diagnostic** — walk a customer complaint through Controls → Equipment
  → Visual → Performance to a likely cause, with next steps, safety flags, the
  tools required, and optional Claude-powered enrichment. No login needed.
- **Signed-in workspace** — technicians get a dashboard, saved reports, and a
  customers → sites → equipment hierarchy with jobs/work orders. Every row is
  scoped to its owner with Postgres row-level security.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase + Anthropic keys
npm run dev
# open http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

Requires **Node.js 20.9+**.

### Environment

See `.env.example`. You need a Supabase project (URL + anon key + service-role
key) and, for AI enrichment, an `ANTHROPIC_API_KEY`. The anon key drives
cookie-based auth and RLS; the service-role key is server-only.

### Database

Apply the SQL migrations in `supabase/migrations/` to your project (via the
Supabase CLI `supabase db push`, or by pasting them into the SQL editor in
order):

- `…_diagnostic_sessions.sql` — the saved-diagnostics table.
- `…_auth_and_projects.sql` — `profiles` (auto-created on sign-up), the
  `customers → sites → equipment` hierarchy, `jobs`, the new `user_id` /
  `equipment_id` / `job_id` columns on `diagnostic_sessions`, and the RLS
  policies that scope every table to its owner.

Auth uses email/password by default. Enable "Confirm email" in the Supabase
dashboard if you want the email-confirmation flow (handled by
`app/auth/callback`).

## Auth & the project tracker

| Route | What it is |
|-------|------------|
| `/login`, `/signup` | Email/password auth (Supabase). |
| `/dashboard` | KPIs (open jobs, scheduled this week, customers, reports) + recent activity. |
| `/reports`, `/reports/[id]` | Saved diagnostics — list and a full report view. |
| `/customers`, `/customers/[id]` | Accounts, their sites, and the equipment at each site. |
| `/jobs`, `/jobs/[id]` | Work orders with status/priority, scheduling, and linked diagnostics. |
| `/account` | Technician profile. |

`proxy.ts` (Next 16's renamed middleware) refreshes the Supabase session on
every request and gates the workspace routes behind sign-in. Server reads use
an RLS-scoped client (`lib/supabase/server.ts`), so a query can only ever see
the signed-in user's rows. Finishing a diagnostic while logged in and tapping
**Save report** tags the row with your `user_id` (and `job_id` if you launched
it from a job).

## Deploy to Vercel

### Option A — Git integration (recommended)

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no extra build settings needed.
4. Every push to `main` deploys to production; PRs get preview URLs.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

### Option C — GitHub Actions

`.github/workflows/vercel-deploy.yml` deploys via the Vercel CLI. Add these repository secrets:

| Secret | Where to find it |
|--------|------------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` |

`.github/workflows/ci.yml` runs typecheck, lint, and build on every push/PR (no Vercel secrets required).

## How it works

The whole experience is driven by one typed data structure and a small render layer.

```
app/
  layout.tsx                     Root layout + no-flash theme bootstrap
  page.tsx                       Landing screen (intro + resume-last-session)
  globals.css                    Design tokens (dark + light) and base styles
  diagnostic/[[...path]]/page.tsx  URL-driven diagnostic route
  api/sessions/route.ts          Stub API for persisting completed sessions

components/
  DiagnosticView.tsx             Composes the screen + keyboard navigation
  TopBar, ProgressBar, Breadcrumb, HistoryTrail, PhaseBar
  UnitSelect, StepCard, Outcome  One component per node type
  ThemeToggle, Logo, styles.ts

lib/
  types.ts                       Discriminated-union node types
  tree.ts                        The canonical decision tree (typed data)
  engine.ts                      Pure path/history/validation helpers
  useDiagnostic.ts               URL <-> state + localStorage persistence
  useTheme.ts                    Dark/light theme, persisted
```

### URL-driven steps

Each step is a node id, and the route is a catch-all of the visited ids:

```
/diagnostic/start/complaint_ac/power_check/thermostat_check
                  └─ unit ──── └─ complaint └─ step ──── └─ current
```

This makes every step **deep-linkable and shareable**, and the browser back
button just works. `lib/engine.ts#sanitizePath` validates an incoming URL and
falls back to the longest valid prefix, so a hand-edited or stale link can't
land on a broken state.

### Adding or editing the tree

Everything lives in `lib/tree.ts`. Each node is keyed by a stable id and
discriminated on `type` (`unit-select` | `yn` | `choice` | `outcome`), so
TypeScript will tell you if a node is missing a field or points at an
unknown branch. No rendering code needs to change to add a branch.

### Theming

Tokens are CSS variables in `globals.css`; Tailwind references them
(`tailwind.config.ts`) so the same utilities work in both themes. Switching
`[data-theme]` re-points every token. Dark is the default field aesthetic.

### Keyboard navigation

- **Y / N / U** — answer a yes/no question
- **1–9** — pick a numbered choice or equipment type
- **← / Backspace / Esc** — go back a step
- **R** — restart

## Notes / next steps

- The tree could later be lifted into JSON/CMS without touching the render
  layer — `lib/engine.ts` only depends on the `TreeMap` shape.
- Content (findings, steps, safety) is field guidance from the original
  prototype — review with an HVAC SME before production use.
- Natural next features for the field: **offline-first / PWA** (queue saves in
  dead zones), **photo attachments** on equipment and reports (Supabase
  Storage), **PDF/share export** of a report for the customer or office, and
  **structured measurement capture** (superheat/subcool, static pressure, amp
  draws) instead of free-text notes. Team/org roles can build on the existing
  `profiles.role` column.
