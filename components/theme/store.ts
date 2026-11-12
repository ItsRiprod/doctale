'use client';
// Site theme state. The source of truth is the `data-theme` attribute on <html> (set before paint by the inline script
// in app/layout.tsx); this module reads/writes it and lets React subscribe. Light/dark stays with next-themes (`.dark`).
import { useSyncExternalStore } from 'react';
import { DEFAULT_THEME, THEME_IDS, THEME_STORAGE_KEY } from '@/app/themes/config';
import type { ThemeId } from '@/app/themes/generated';

export const isThemeId = (v: unknown): v is ThemeId => typeof v === 'string' && (THEME_IDS as readonly string[]).includes(v);

export function getSiteTheme(): ThemeId {
  const t = document.documentElement.getAttribute('data-theme');
  return isThemeId(t) ? t : DEFAULT_THEME;
}

export function setSiteTheme(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {}
}

/** Re-renders on any change to <html> `data-theme` or `class` (site theme or light/dark). */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  return () => observer.disconnect();
}

export function useSiteTheme(): ThemeId {
  return useSyncExternalStore(subscribe, getSiteTheme, () => DEFAULT_THEME);
}

/** Changes whenever the rendered palette changes: `<theme>:<light|dark>`. */
export function usePaletteKey(): string {
  return useSyncExternalStore(
    subscribe,
    () => `${getSiteTheme()}:${document.documentElement.classList.contains('dark') ? 'dark' : 'light'}`,
    () => `${DEFAULT_THEME}:light`,
  );
}
