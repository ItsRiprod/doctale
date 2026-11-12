'use client';
// Always mounted (components/provider.tsx): keeps <meta name="theme-color"> on the active palette and follows
// theme changes made in other tabs.
import { useEffect } from 'react';
import { THEME_STORAGE_KEY } from '@/app/themes/config';
import { isThemeId, usePaletteKey } from './store';

export function ThemeSync() {
  const palette = usePaletteKey();

  useEffect(() => {
    const bg = getComputedStyle(document.body).backgroundColor;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.append(meta);
    }
    meta.content = bg;
  }, [palette]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && isThemeId(e.newValue)) document.documentElement.setAttribute('data-theme', e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
}
