/** Server-side environment helpers. Never import from client components. */

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function isAiEnrichmentEnabled(): boolean {
  return process.env.ENABLE_AI_ENRICHMENT !== 'false';
}

/**
 * Whether the AI is allowed to drive the diagnostic (ask questions / conclude).
 * Falls back to the enrichment switch so a single env var can disable all AI,
 * but can be toggled independently via ENABLE_AI_DIAGNOSIS.
 */
export function isAiDiagnosisEnabled(): boolean {
  if (process.env.ENABLE_AI_DIAGNOSIS === 'false') return false;
  if (process.env.ENABLE_AI_DIAGNOSIS === 'true') return true;
  return isAiEnrichmentEnabled();
}

export function hasAnthropicApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getAnthropicApiKey(): string {
  return required('ANTHROPIC_API_KEY');
}

export function getClaudeModel(): string {
  return process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-20250514';
}

export function getPromptVersion(): string {
  return process.env.DIAGNOSE_PROMPT_VERSION ?? '2';
}

export function getSupabaseUrl(): string {
  return required('NEXT_PUBLIC_SUPABASE_URL');
}

/**
 * Anon (publishable) key — safe to expose to the browser. Reads the modern
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY` and falls back to the publishable-key name.
 */
export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    (() => {
      throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
    })()
  );
}

export function getSupabaseServiceRoleKey(): string {
  return required('SUPABASE_SERVICE_ROLE_KEY');
}
