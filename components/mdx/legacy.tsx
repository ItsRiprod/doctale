// Legacy Starlight component names, kept so ported content compiles unchanged (see MIGRATION-PLAN.md §2).
// Phase 0: placeholder stubs that render children inside a labelled box.
// WS-B owns this file and replaces each stub with a real implementation on top of Fumadocs/Catalyst.
// Prop names below are the frozen contract; keep them exactly as Starlight's.
import type { ReactNode } from 'react';

function Stub({ name, children, detail }: { name: string; children?: ReactNode; detail?: string }) {
  return (
    <div data-legacy-stub={name} className="my-4 rounded-lg border border-dashed border-fd-border p-3">
      <div className="mb-2 font-mono text-xs text-fd-muted-foreground">
        &lt;{name}&gt; stub{detail ? ` · ${detail}` : ''}
      </div>
      {children}
    </div>
  );
}

export type AsideType = 'note' | 'tip' | 'caution' | 'danger';
export function Aside(props: { type?: AsideType; title?: string; children?: ReactNode }) {
  return <Stub name="Aside" detail={[props.type ?? 'note', props.title].filter(Boolean).join(' · ')}>{props.children}</Stub>;
}

export function Tabs(props: { syncKey?: string; children?: ReactNode }) {
  return <Stub name="Tabs">{props.children}</Stub>;
}

export function TabItem(props: { label: string; icon?: string; children?: ReactNode }) {
  return <Stub name="TabItem" detail={props.label}>{props.children}</Stub>;
}

export function Steps(props: { children?: ReactNode }) {
  return <Stub name="Steps">{props.children}</Stub>;
}

export function FileTree(props: { children?: ReactNode }) {
  return <Stub name="FileTree">{props.children}</Stub>;
}

export function Card(props: { title: string; icon?: string; children?: ReactNode }) {
  return <Stub name="Card" detail={props.title}>{props.children}</Stub>;
}

export function CardGrid(props: { stagger?: boolean; children?: ReactNode }) {
  return <Stub name="CardGrid">{props.children}</Stub>;
}

export function LinkCard(props: { title: string; href: string; description?: string }) {
  return (
    <Stub name="LinkCard" detail={props.title}>
      <a href={props.href}>{props.description ?? props.href}</a>
    </Stub>
  );
}

export type BadgeVariant = 'default' | 'note' | 'tip' | 'caution' | 'danger' | 'success';
export function Badge(props: { text: string; variant?: BadgeVariant; size?: 'small' | 'medium' | 'large' }) {
  return <code data-legacy-stub="Badge">[{props.text}]</code>;
}
