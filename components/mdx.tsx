// MDX component registry. Every widget is global: content files never import components.
// Owner: WS-B (WS-C sends Mermaid/image registrations here). Contract: MIGRATION-PLAN.md §2.
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Tab, Tabs as FdTabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps as FdSteps } from 'fumadocs-ui/components/steps';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Banner } from 'fumadocs-ui/components/banner';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { Mermaid } from './mdx/mermaid';
import * as legacy from './mdx/legacy';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Native Fumadocs names (preferred for new content). `Tabs`/`Steps`/`Card` collide with the
    // legacy names, so the native versions are also exposed as `FdTabs`/`FdSteps`.
    Tab,
    FdTabs,
    Step,
    FdSteps,
    Files,
    Folder,
    File,
    Accordion,
    Accordions,
    TypeTable,
    Banner,
    InlineTOC,
    Mermaid,
    // Legacy Starlight names (ported content). These win over same-named natives.
    ...legacy,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
