import { llms, loader } from 'fumadocs-core/source';
import { docsRoute } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { applyMdxPreset } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins/rehype-code';
import { remarkMdxMermaid } from 'fumadocs-core/mdx-plugins/remark-mdx-mermaid';
import { transformerMetaHighlight } from '@shikijs/transformers';
import { createCssVariablesTheme } from 'shiki';
import { z } from 'zod';

// `sidebarTitle`: shorter label for the sidebar when it differs from the page title (ported from Starlight sidebar labels).
const docSchema = pageSchema.extend({ sidebarTitle: z.string().optional() });

const codeDefaults = rehypeCodeDefaultOptions;
const varsTheme = createCssVariablesTheme({ name: 'css-variables', variablePrefix: '--shiki-', fontStyle: false });

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: docSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
    // WS-C owns everything inside mdxOptions.
    mdxOptions: applyMdxPreset({
      remarkPlugins: (v) => [remarkMdxMermaid, ...v],
      rehypeCodeOptions: {
        ...codeDefaults,
        // One CSS-variables theme: tokens are `color: var(--shiki-token-*)`, and app/themes/code.css sets those variables
        // per site theme + light/dark (generated from real Shiki themes, see scripts/themes/code-css.mjs).
        // rehypeCode merges its own light/dark `themes` under these options, so `themes` must be overridden (not `theme`).
        // A single entry + defaultColor 'light' makes Shiki write one inline `color: var(--shiki-token-*)` per token.
        themes: { light: varsTheme },
        defaultColor: 'light',
        transformers: [
          ...(codeDefaults.transformers ?? []),
          // Starlight/Expressive Code style `{19-22,27}` line ranges.
          transformerMetaHighlight(),
          // Expressive Code `wrap` meta: soft-wrap long lines (styled by `.code-wrap` in app/global.css).
          {
            name: 'doctale:meta-wrap',
            pre(node) {
              if (/(^|\s)wrap(\s|$)/.test(this.options.meta?.__raw ?? '')) this.addClassToHast(node, 'code-wrap');
            },
          },
        ],
      },
    }),
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
  pageTree: {
    transformers: [
      {
        file(node, filePath) {
          if (!filePath) return node;
          const file = this.storage.read(filePath);
          const sidebarTitle = file?.format === 'page' ? (file.data as { sidebarTitle?: string }).sidebarTitle : undefined;
          return sidebarTitle ? { ...node, name: sidebarTitle } : node;
        },
      },
    ],
  },
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText('processed')}`,
});
