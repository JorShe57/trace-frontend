import type { Config } from 'tailwindcss';

/**
 * Design tokens are declared as CSS variables in app/globals.css and surfaced
 * to Tailwind here. Swapping the [data-theme] attribute re-points every token,
 * so the same utility classes drive both the dark (default) and light themes.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        bg4: 'var(--bg4)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        text: 'var(--text)',
        text2: 'var(--text2)',
        text3: 'var(--text3)',
        accent: 'var(--accent)',
        accent2: 'var(--accent2)',
        danger: 'var(--red)',
        warn: 'var(--yellow)',
      },
      fontFamily: {
        head: 'var(--hf)',
        mono: 'var(--mf)',
        body: 'var(--bf)',
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      maxWidth: {
        shell: '680px',
      },
    },
  },
  plugins: [],
};

export default config;
