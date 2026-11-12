// Legacy Starlight component names, so ported content renders unchanged (MIGRATION-PLAN.md §2).
// Each one is a thin adapter over the native Fumadocs component (or Catalyst for Badge).
// Prop names are the frozen contract; keep them exactly as Starlight's.
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tab, Tabs as FdTabs } from 'fumadocs-ui/components/tabs';
import { Card as FdCard, Cards } from 'fumadocs-ui/components/card';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Badge as CatalystBadge } from '@/components/catalyst/badge';
import {
  BookOpen, Braces, Dot, Heart, Info, Leaf, type LucideIcon, Pencil, Puzzle, Rocket, Settings, Settings2, Star, TriangleAlert,
} from 'lucide-react';

// ---------- Aside ----------
export type AsideType = 'note' | 'tip' | 'caution' | 'danger';
const asideToCallout = { note: 'info', tip: 'idea', caution: 'warn', danger: 'error' } as const;

export function Aside({ type = 'note', title, children }: { type?: AsideType; title?: string; children?: ReactNode }) {
  return (
    <Callout type={asideToCallout[type] ?? 'info'} title={title}>
      {children}
    </Callout>
  );
}

// ---------- Tabs / TabItem ----------
type TabItemProps = { label: string; icon?: string; children?: ReactNode };

export function TabItem({ label, children }: TabItemProps) {
  return <Tab value={label}>{children}</Tab>;
}

export function Tabs({ children }: { syncKey?: string; children?: ReactNode }) {
  // Starlight reads tab labels from the TabItem children; Fumadocs wants them up front as `items`.
  const items = Children.toArray(children)
    .filter((c): c is ReactElement<TabItemProps> => isValidElement(c) && typeof (c.props as TabItemProps).label === 'string')
    .map((c) => c.props.label);
  return <FdTabs items={items}>{children}</FdTabs>;
}

// ---------- Steps ----------
// Starlight's <Steps> wraps a plain markdown ordered list; app/global.css styles `.legacy-steps > ol > li` as Fumadocs steps.
export function Steps({ children }: { children?: ReactNode }) {
  return <div className="legacy-steps">{children}</div>;
}

// ---------- FileTree ----------
// Starlight syntax: a markdown list. `name/` or an item with a nested list is a folder. Text after the first
// space is a comment. `**name**` highlights. `...` / `…` is a placeholder.
type Props = { children?: ReactNode };

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<Props>(node)) return textOf(node.props.children);
  return '';
}

function isList(node: ReactNode): node is ReactElement<Props> {
  return isValidElement(node) && (node.type === 'ul' || node.type === 'ol');
}

function renderList(list: ReactElement<Props>, depth: number): ReactNode[] {
  return Children.toArray(list.props.children)
    .filter((li): li is ReactElement<Props> => isValidElement(li) && li.type === 'li')
    .map((li, i) => renderItem(li, depth, i));
}

function renderItem(li: ReactElement<Props>, depth: number, key: number): ReactNode {
  const parts = Children.toArray(li.props.children);
  // A loose list wraps item text in <p>; unwrap it.
  const flat = parts.flatMap((p) => (isValidElement<Props>(p) && p.type === 'p' ? Children.toArray(p.props.children) : [p]));
  const nested = flat.find(isList);
  const label = flat.filter((p) => !isList(p));
  const highlighted = label.some((p) => isValidElement(p) && p.type === 'strong');
  const raw = textOf(label).trim();
  const [, rawName = raw, comment] = raw.match(/^(\S+)\s+(.*)$/s) ?? [];
  const isFolder = Boolean(nested) || rawName.endsWith('/');
  const name = (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={highlighted ? 'font-semibold text-fd-primary' : undefined}>{isFolder ? rawName.replace(/\/$/, '') : rawName}</span>
      {comment ? <span className="text-fd-muted-foreground">{comment}</span> : null}
    </span>
  );
  // Fumadocs types `name` as string, but renders it as a node.
  const n = name as unknown as string;
  if (isFolder) {
    return (
      <Folder key={key} name={n} defaultOpen>
        {nested ? renderList(nested, depth + 1) : null}
      </Folder>
    );
  }
  return <File key={key} name={n} />;
}

export function FileTree({ children }: { children?: ReactNode }) {
  const list = Children.toArray(children).find(isList);
  return <Files className="my-6">{list ? renderList(list, 0) : children}</Files>;
}

// ---------- Cards ----------
// Starlight icon names -> Lucide icons (only a handful are used; unknown names fall back to a dot).
const starlightIcons: Record<string, LucideIcon> = {
  heart: Heart, leaf: Leaf, setting: Settings, star: Star, warning: TriangleAlert, 'seti:config': Settings2,
  'seti:less': Braces, rocket: Rocket, information: Info, puzzle: Puzzle, 'open-book': BookOpen, pencil: Pencil,
};
const icon = (name?: string) => {
  if (!name) return undefined;
  const Icon = starlightIcons[name] ?? Dot;
  return <Icon />;
};

// Also accepts native Fumadocs Card props (`href`, `description`), because this name overrides the native Card.
export function Card({ title, icon: iconName, href, description, children }: { title: string; icon?: string; href?: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <FdCard title={title} icon={icon(iconName)} href={href} description={description}>
      {children}
    </FdCard>
  );
}

export function CardGrid({ children }: { stagger?: boolean; children?: ReactNode }) {
  return <Cards>{children}</Cards>;
}

export function LinkCard({ title, href, description }: { title: string; href: string; description?: string }) {
  return <FdCard title={title} href={href} description={description} />;
}

// ---------- Badge ----------
export type BadgeVariant = 'default' | 'note' | 'tip' | 'caution' | 'danger' | 'success';
// Theme-following colours for neutral/informational variants; caution/success keep fixed semantic colours.
const badgeColor = { default: 'neutral', note: 'primary', tip: 'chart-2', caution: 'amber', danger: 'destructive', success: 'green' } as const;

export function Badge({ text, variant = 'default' }: { text: string; variant?: BadgeVariant; size?: 'small' | 'medium' | 'large' }) {
  return <CatalystBadge color={badgeColor[variant] ?? 'neutral'}>{text}</CatalystBadge>;
}
