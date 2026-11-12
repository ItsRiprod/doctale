'use client';
// Site theme picker (Catalyst Dropdown) + Fumadocs' light/dark switch. Replaces the layout's theme switch slot
// (lib/layout.shared.tsx), so it sits in the docs sidebar footer and the home navbar.
import { CheckIcon, PaletteIcon } from 'lucide-react';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { Dropdown, DropdownButton, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/catalyst/dropdown';
import { themes } from '@/app/themes/generated';
import { setSiteTheme, usePaletteKey } from './store';

function Swatch({ background, primary }: { background: string; primary: string }) {
  return (
    <span
      data-slot="icon"
      aria-hidden
      className="relative inline-flex size-4 shrink-0 overflow-hidden rounded-full ring-1 ring-fd-border"
      style={{ background }}
    >
      <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: primary }} />
    </span>
  );
}

export function ThemePicker({ className }: { className?: string }) {
  const [current, scheme] = usePaletteKey().split(':') as [string, 'light' | 'dark'];
  const active = themes.find((t) => t.id === current);

  return (
    <div className={['flex items-center gap-1.5', className].filter(Boolean).join(' ')}>
      <Dropdown>
        <DropdownButton
          plain
          aria-label={`Site theme: ${active?.label ?? current}`}
          title="Site theme"
          className="px-2! py-1! text-xs! font-medium!"
        >
          <PaletteIcon data-slot="icon" />
          <span className="max-w-28 truncate">{active?.label ?? current}</span>
        </DropdownButton>
        <DropdownMenu anchor="top end" className="z-50 max-h-[min(28rem,70vh)] min-w-56 overflow-y-auto">
          {themes.map((t) => (
            <DropdownItem key={t.id} onClick={() => setSiteTheme(t.id)}>
              <Swatch {...t.swatch[scheme]} />
              <DropdownLabel>{t.label}</DropdownLabel>
              {t.id === current ? <CheckIcon aria-hidden className="col-start-5 row-start-1 size-4 justify-self-end" /> : null}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <ThemeSwitch mode="light-dark-system" />
    </div>
  );
}
