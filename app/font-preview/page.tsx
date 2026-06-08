import Link from 'next/link';

/* A self-contained typography playground. The whole app themes its type
   through three CSS variables — --hf (headings), --bf (body), --mf (mono) —
   which the font-head / font-body / font-mono utilities reference. Each option
   below overrides those three variables on a scoped container, so every sample
   renders exactly the way the real UI would with that pairing. Throwaway page:
   pick a winner and we apply it in globals.css. */

// Every candidate family, loaded in one request.
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500&family=Bebas+Neue&family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Sans+Condensed:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Oswald:wght@500;600;700&family=Rajdhani:wght@500;600;700&family=Saira+Condensed:wght@500;600;700&family=Saira:wght@400;500&family=Space+Mono:wght@400;700&display=swap';

type Vars = React.CSSProperties & Record<string, string>;

type FontOption = {
  name: string;
  head: string;
  body: string;
  mono: string;
  note: string;
};

const OPTIONS: FontOption[] = [
  {
    name: 'Current — Barlow',
    head: "'Barlow Condensed', sans-serif",
    body: "'Barlow', sans-serif",
    mono: "'JetBrains Mono', monospace",
    note: 'What you have now. Condensed industrial headings, clean humanist body, technical mono.',
  },
  {
    name: 'IBM Plex',
    head: "'IBM Plex Sans Condensed', sans-serif",
    body: "'IBM Plex Sans', sans-serif",
    mono: "'IBM Plex Mono', monospace",
    note: 'One cohesive engineering family. Reads as serious, consistent, and very “instrument panel”.',
  },
  {
    name: 'Oswald + Inter',
    head: "'Oswald', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
    note: 'Strong poster-style headings paired with the most neutral, legible body around.',
  },
  {
    name: 'Rajdhani + Inter',
    head: "'Rajdhani', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Space Mono', monospace",
    note: 'Squared, condensed HUD/instrument feel. Leans techy without going full sci-fi.',
  },
  {
    name: 'Chakra Petch',
    head: "'Chakra Petch', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Space Mono', monospace",
    note: 'Mechanical, squarish display type — the most “cyber/industrial” of the set.',
  },
  {
    name: 'Saira',
    head: "'Saira Condensed', sans-serif",
    body: "'Saira', sans-serif",
    mono: "'IBM Plex Mono', monospace",
    note: 'Sporty technical family with condensed headings. A close cousin of the current look.',
  },
  {
    name: 'Bebas Neue + Inter',
    head: "'Bebas Neue', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
    note: 'Ultra-condensed all-caps headings — bold and loud. Great for big numbers, less for long titles.',
  },
];

/** A representative slice of real T.R.A.C.E. UI rendered in one font pairing. */
function Sample({ option }: { option: FontOption }) {
  const vars: Vars = {
    '--hf': option.head,
    '--bf': option.body,
    '--mf': option.mono,
  };
  return (
    <div
      style={vars}
      className="rounded-card border border-border2 bg-bg2 p-5"
    >
      {/* Option header */}
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-border pb-3">
        <h2 className="font-head text-[22px] font-bold tracking-[0.06em] text-text">
          {option.name}
        </h2>
        <code className="font-mono text-[9px] text-text3">
          head · body · mono
        </code>
      </div>
      <p className="mb-5 text-[12px] leading-relaxed text-text2">{option.note}</p>

      {/* Page heading sample */}
      <div className="font-head text-[24px] font-bold tracking-[0.06em] text-text">Dashboard</div>
      <p className="mt-0.5 text-[12px] text-text2">
        Your open work, saved reports, and diagnostics in one place.
      </p>

      {/* KPIs */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          ['12', 'Open jobs'],
          ['4', 'This week'],
          ['37', 'Reports'],
        ].map(([v, l]) => (
          <div key={l} className="rounded-card border border-border2 bg-bg3 px-3 py-3">
            <div className="font-head text-[30px] font-bold leading-none text-text">{v}</div>
            <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-text3">
              {l}
            </div>
          </div>
        ))}
      </div>

      {/* Body copy + mono label */}
      <div className="mt-4 rounded-card border border-border2 bg-bg3 px-4 py-3">
        <div className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-text3">
          Superheat — low side
        </div>
        <p className="text-[13px] leading-relaxed text-text">
          Line temp minus saturation temp. Low superheat risks liquid flooding the compressor;
          high superheat suggests an undercharge or low load. Clamp the probe near the compressor
          and read the low-side gauge.
        </p>
        <div className="mt-2 font-mono text-[28px] font-bold tabular-nums text-accent">
          12.4°F
        </div>
      </div>

      {/* Buttons + badge */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-[4px] border border-accent bg-[var(--accent-dim)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
          Start diagnostic →
        </span>
        <span className="inline-flex items-center justify-center rounded-[4px] border border-border2 bg-bg2 px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.08em] text-text2">
          + New job
        </span>
        <span className="inline-block rounded-[3px] border border-accent/30 bg-[var(--accent-dim)] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-accent">
          AI
        </span>
      </div>

      {/* Font stack footnote */}
      <div className="mt-4 space-y-0.5 font-mono text-[9px] text-text3">
        <div>head: {option.head}</div>
        <div>body: {option.body}</div>
        <div>mono: {option.mono}</div>
      </div>
    </div>
  );
}

export default function FontPreviewPage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONT_HREF} />

      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="mb-8">
          <h1 className="font-head text-[28px] font-bold tracking-[0.06em] text-text">
            Font options
          </h1>
          <p className="mt-1 max-w-[640px] text-[13px] leading-relaxed text-text2">
            Each card renders the same UI slice with a different type pairing, driven by the same
            three variables the app uses (<code className="font-mono text-[11px]">--hf</code> /{' '}
            <code className="font-mono text-[11px]">--bf</code> /{' '}
            <code className="font-mono text-[11px]">--mf</code>). Tell me which one you want and
            I&apos;ll wire it into <code className="font-mono text-[11px]">globals.css</code>.
          </p>
          <Link
            href="/dashboard"
            className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.08em] text-text3 hover:text-accent"
          >
            ← Back to app
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {OPTIONS.map((option) => (
            <Sample key={option.name} option={option} />
          ))}
        </div>
      </main>
    </>
  );
}
