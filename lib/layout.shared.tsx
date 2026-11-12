import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { ThemePicker } from '@/components/theme/theme-picker';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="" width={24} height={24} unoptimized />
          {appName}
        </span>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    // Site theme picker + light/dark switch, in the slot Fumadocs uses for its light/dark toggle.
    themeSwitch: { component: <ThemePicker /> },
  };
}
