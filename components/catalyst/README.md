# Catalyst components (adapted)

Copied from the Tailwind Plus **Catalyst** UI kit (`catalyst-ui-kit/typescript/*.tsx`) and adapted for this site.
The kit itself (`catalyst-ui-kit.zip`) is paid content and is git-ignored. Never commit the zip or the raw kit.
Check the Tailwind Plus licence for open-source use before release (see MIGRATION-PLAN.md §6).

Adaptations so far:
- `link.tsx` uses `next/link`.
- `'use client'` added to files that use Headless UI or React state.

Pending (WS-A): add `primary`/`neutral` colour variants that use theme tokens (`bg-primary`, `text-primary-foreground`,
`border-border`, …) so every pulled theme reaches these components. They currently hard-code `zinc-*`/`blue-*`.
