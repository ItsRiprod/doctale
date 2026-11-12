import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from '@/components/provider';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://doctale.dev'),
};

// Phase 0 minimal pre-paint theme script. WS-A owns this: registry-validated ids, fallback to DEFAULT_THEME.
// `?theme=<id>` overrides for QA/screenshots. Must set the attribute on <html> (see app/global.css).
const themeScript = `(function(){try{var q=new URLSearchParams(location.search).get('theme');var t=q||localStorage.getItem('doctale-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`;

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
