import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'T.R.A.C.E. — Diagnostic Decision Tree',
  description:
    'A guided HVAC/R field diagnostic tool. Walk a complaint to a likely cause, with next steps, safety flags and the tools you need.',
};

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

// Set the persisted theme before first paint to avoid a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('trace.theme');if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
