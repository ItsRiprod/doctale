'use client';
import SearchDialog from '@/components/search';
import { ThemeSync } from '@/components/theme/theme-sync';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }}>
      <ThemeSync />
      {children}
    </RootProvider>
  );
}
