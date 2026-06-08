# T.R.A.C.E. — Diagnostic Decision Tree

A guided HVAC/R field diagnostic tool, scaffolded as a **Next.js 14 (App Router) + TypeScript + Tailwind** front end. Walk a customer complaint through Controls → Equipment → Visual → Performance phases to a likely cause, complete with next steps, safety flags and the tools required.

This is a faithful, lightly-polished port of the original single-file HTML prototype.

## Getting started

```bash
npm install
npm run dev
# open http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run typecheck`.

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

- `app/api/sessions/route.ts` is a stub — wire it to a datastore to log
  completed diagnostics, then POST from the Outcome card.
- The tree could later be lifted into JSON/CMS without touching the render
  layer — `lib/engine.ts` only depends on the `TreeMap` shape.
- Content (findings, steps, safety) is field guidance from the original
  prototype — review with an HVAC SME before production use.
