import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/* A small set of presentational primitives sharing the TRACE design
   tokens (defined in globals.css). Server-component friendly — no client
   hooks here. */

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card border border-border bg-bg2 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.05em] text-text3">
      {children}
    </div>
  );
}

export function PageHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.025em] text-text">{title}</h1>
        {subtitle && <p className="mt-1 text-[13.5px] text-text2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Heading row for a dashboard/list section, with an optional trailing link. */
export function SectionHeader({
  title,
  href,
  linkLabel = 'View all →',
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-text">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-[12.5px] font-medium text-text3 transition-colors hover:text-text"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

type ButtonVariant = 'primary' | 'ghost' | 'danger';

const buttonBase =
  'inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-[var(--accent-contrast)] hover:bg-accent2',
  ghost: 'border border-border2 bg-bg2 text-text2 hover:bg-bg3 hover:text-text',
  danger: 'border border-danger/30 bg-[var(--red-bg)] text-danger hover:border-danger',
};

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  variant = 'primary',
  className = '',
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={`${buttonBase} ${buttonVariants[variant]} ${className}`} {...props} />;
}

export function Field({
  label,
  name,
  hint,
  children,
}: {
  label: string;
  name?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={name}>
      <span className="mb-1.5 block text-[12px] font-medium text-text2">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-text3">{hint}</span>}
    </label>
  );
}

const controlClass =
  'w-full rounded-lg border border-border2 bg-bg3 px-3 py-2 text-[13.5px] text-text placeholder:text-text3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--accent-dim)]';

export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={`${controlClass} ${props.className ?? ''}`} />;
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea {...props} className={`${controlClass} ${props.className ?? ''}`} />;
}

export function Select(props: ComponentProps<'select'>) {
  return <select {...props} className={`${controlClass} ${props.className ?? ''}`} />;
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="px-5 py-12 text-center">
      <p className="text-[14px] font-medium text-text2">{title}</p>
      {hint && <p className="mx-auto mt-1.5 max-w-[360px] text-[12.5px] text-text3">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </Card>
  );
}

const statusTone: Record<string, string> = {
  open: 'border-accent/30 bg-[var(--accent-dim)] text-accent',
  in_progress: 'border-yellow/30 bg-[var(--yellow-bg)] text-warn',
  on_hold: 'border-border2 bg-bg3 text-text2',
  done: 'border-accent/30 bg-[var(--accent-faint)] text-accent',
  cancelled: 'border-danger/30 bg-[var(--red-bg)] text-danger',
  urgent: 'border-danger/30 bg-[var(--red-bg)] text-danger',
  high: 'border-yellow/30 bg-[var(--yellow-bg)] text-warn',
};

export function Badge({ tone, children }: { tone?: string; children: ReactNode }) {
  const cls = (tone && statusTone[tone]) || 'border-border2 bg-bg3 text-text2';
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {children}
    </span>
  );
}

export function ErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-3 rounded-lg border border-danger/30 bg-[var(--red-bg)] px-3.5 py-2.5 text-[13px] text-danger">
      {message}
    </div>
  );
}
