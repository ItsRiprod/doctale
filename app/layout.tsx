import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Provider } from '@/components/provider';
import { DEFAULT_THEME, THEME_IDS, THEME_STORAGE_KEY } from '@/app/themes/config';
import { appName } from '@/lib/shared';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://doctale.dev'),
  title: { default: 'Hytale Modding Docs', template: `%s | ${appName}` },
  description:
    'Community-driven documentation for Hytale server modding: plugins, assets, and the systems underneath. Unofficial community resource.',
  openGraph: { type: 'website', siteName: 'Hytale Server Modding Docs' },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  // Updated at runtime to the active theme's background (components/theme/theme-sync.tsx).
  themeColor: '#ffffff',
};

// Runs before first paint: apply the saved site theme to <html> (no flash). Unknown or removed ids fall back to
// the default. `?theme=<id>` previews a theme without saving it (handy for QA and screenshots).
const themeScript = `(function(){try{var ids=${JSON.stringify(THEME_IDS)};var q=new URLSearchParams(location.search).get('theme');var t=q||localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});document.documentElement.setAttribute('data-theme',ids.indexOf(t)>-1?t:${JSON.stringify(DEFAULT_THEME)})}catch(e){}})()`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
