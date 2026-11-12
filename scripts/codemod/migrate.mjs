#!/usr/bin/env node
// WS-D content codemod: legacy/astro (Starlight) -> content/docs (Fumadocs).
// Idempotent: regenerates every ported page and meta.json from the legacy sources on each run.
// Pages that only exist in content/docs (e.g. _kitchen-sink.mdx) are left alone.
//
//   node scripts/codemod/migrate.mjs           # write files + report
//   node scripts/codemod/migrate.mjs --check   # report only, write nothing
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { readSidebar } from './read-sidebar.mjs';

const SRC = 'legacy/astro/src/content/docs';
const OUT = 'content/docs';
const CHECK = process.argv.includes('--check');

// Components the site registers globally (components/mdx.tsx). Anything else used in content is reported.
const KNOWN_COMPONENTS = new Set([
  'Aside', 'Tabs', 'TabItem', 'Steps', 'FileTree', 'Card', 'CardGrid', 'LinkCard', 'Badge',
  'Callout', 'Tab', 'FdTabs', 'Step', 'FdSteps', 'Files', 'Folder', 'File', 'Cards',
  'Accordion', 'Accordions', 'TypeTable', 'Banner', 'InlineTOC', 'Mermaid',
]);
const KNOWN_FENCE_META = [/^title=("[^"]*"|'[^']*')$/, /^\{[\d,\s-]+\}$/, /^wrap$/];
const SKIP = new Set(['index']); // the splash home page becomes app/(home)/page.tsx

const report = { pages: 0, escaped: 0, droppedH1: 0, unknownComponents: {}, unknownFenceMeta: {}, rawHtml: {}, notInSidebar: [], sidebarTitles: 0 };
const bump = (bucket, key, file) => ((bucket[key] ??= new Set()).add(file));

// ---------- 1. sidebar -> label map + meta.json ----------
const sidebar = readSidebar();
const labelBySlug = new Map();
const metas = new Map(); // folder (relative to OUT, '' = root) -> meta object

const folderOf = (items) => {
  // Every Starlight group maps to exactly one folder: the common parent of its direct pages and subgroups.
  const dirs = new Set();
  for (const it of items) {
    if (it.slug) dirs.add(dirname(it.slug));
    else if (it.items) dirs.add(dirname(folderOf(it.items)));
  }
  if (dirs.size !== 1) throw new Error(`sidebar group spans several folders: ${[...dirs].join(', ')}`);
  return [...dirs][0];
};

function walkGroup(group) {
  const folder = folderOf(group.items);
  const pages = [];
  for (const it of group.items) {
    if (it.slug) {
      labelBySlug.set(it.slug, it.label);
      pages.push(it.slug.split('/').pop());
    } else if (it.items) {
      pages.push(walkGroup(it).split('/').pop());
    } else throw new Error(`unsupported sidebar entry ${JSON.stringify(it)}`);
  }
  metas.set(folder, { title: group.label, pages, ...(group.collapsed === false ? { defaultOpen: true } : {}) });
  return folder;
}

const rootPages = [];
for (const top of sidebar) {
  if (!top.items) throw new Error(`top-level sidebar entry must be a group: ${JSON.stringify(top)}`);
  const folder = walkGroup(top);
  // Starlight top-level groups are non-collapsible section headers -> separator + extracted folder.
  rootPages.push(`---${top.label}---`, `...${folder}`);
}
metas.set('', { pages: rootPages });

// ---------- 2. pages ----------
function listPages(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) listPages(p, acc);
    else if (/\.mdx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

function yamlString(v) {
  return /^[\w ()&→.,'-]+$/.test(v) && !/^[\d-]/.test(v) && !v.includes(': ') ? v : JSON.stringify(v);
}

function transformFrontmatter(fm, slug) {
  const lines = fm.split('\n');
  const out = [];
  let skipping = false;
  for (const line of lines) {
    if (/^(template|hero):/.test(line)) { skipping = true; continue; }
    if (skipping && /^\s/.test(line)) continue; // nested keys of a dropped block
    skipping = false;
    out.push(line);
  }
  const title = (fm.match(/^title:\s*(.*)$/m)?.[1] ?? '').trim().replace(/^(["'])(.*)\1$/, '$2');
  const label = labelBySlug.get(slug);
  if (label && label !== title) {
    out.push(`sidebarTitle: ${yamlString(label)}`);
    report.sidebarTitles++;
  }
  return out.join('\n');
}

function scan(body, rel) {
  let inFence = false;
  for (const line of body.split('\n')) {
    const fence = line.match(/^\s*(```+|~~~+)\s*([\w-]*)\s*(.*)$/);
    if (fence) {
      if (!inFence && fence[3]) {
        // split meta on spaces outside quotes
        for (const tok of fence[3].match(/\w+=("[^"]*"|'[^']*')|\{[^}]*\}|\S+/g) ?? []) {
          if (!KNOWN_FENCE_META.some((re) => re.test(tok))) bump(report.unknownFenceMeta, tok, rel);
        }
      }
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const noCode = line.replace(/`[^`]*`/g, '');
    for (const m of noCode.matchAll(/(?<!\\)<([A-Z][\w.]*)/g)) if (!KNOWN_COMPONENTS.has(m[1])) bump(report.unknownComponents, m[1], rel);
    for (const m of noCode.matchAll(/(?<!\\)<([a-z][\w-]*)[\s>/]/g)) bump(report.rawHtml, m[1], rel);
  }
}

// `{Name}` outside code is an MDX expression that evaluates a JS identifier (e.g. `{Set}` -> the Set constructor).
// In docs it is always a placeholder, so escape the braces. Inline code spans are left alone.
function escapeBarePlaceholders(body) {
  let inFence = false;
  return body
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line
        .split(/(`[^`]*`)/)
        .map((part, i) => (i % 2 ? part : part.replace(/(?<!\\)\{([A-Za-z_]\w*)\}/g, (_, id) => { report.escaped++; return `\\{${id}\\}`; })))
        .join('');
    })
    .join('\n');
}

// Many pages repeat the frontmatter title as a body `# H1`; the layout already renders the title.
// Drop the first body H1 only when it matches the title exactly.
function dropDuplicateH1(body, title) {
  const re = /^# (.+)\n+/m;
  const h1 = body.match(re);
  if (!h1 || h1[1].trim() !== title) return body;
  const before = body.slice(0, h1.index);
  if (/^\s*(```|~~~)/m.test(before)) return body; // H1 found after an opening fence: not a real heading
  report.droppedH1++;
  return before + body.slice(h1.index + h1[0].length);
}

function transformBody(body) {
  return escapeBarePlaceholders(body)
    // Starlight component imports: every widget is global now.
    .replace(/^import\s*\{[^}]*\}\s*from\s*['"]@astrojs\/starlight\/components['"];?[ \t]*\n/gm, '')
    // collapse the blank lines the import removal can leave at the top of the body
    .replace(/^\n{2,}/, '\n');
}

const written = new Set();
for (const file of listPages(SRC)) {
  const rel = relative(SRC, file);
  const slug = rel.replace(/\.mdx?$/, '');
  if (SKIP.has(slug)) continue;
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${rel}: no frontmatter`);
  const title = (m[1].match(/^title:\s*(.*)$/m)?.[1] ?? '').trim().replace(/^(["'])(.*)\1$/, '$2');
  const out = `---\n${transformFrontmatter(m[1], slug)}\n---\n${dropDuplicateH1(transformBody(m[2]), title)}`;
  scan(out, rel);
  if (!labelBySlug.has(slug)) report.notInSidebar.push(slug);
  report.pages++;
  const dest = join(OUT, rel);
  written.add(dest);
  if (!CHECK) {
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, out);
  }
}

if (!CHECK) {
  for (const [folder, meta] of metas) {
    const dest = join(OUT, folder, 'meta.json');
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, `${JSON.stringify(meta, null, 2)}\n`);
  }
  // Phase 0 spike page is retired by the migration (contract §2: WS-D deletes it).
  if (existsSync(join(OUT, 'test.mdx'))) rmSync(join(OUT, 'test.mdx'));
}

// ---------- 3. report ----------
const fmt = (bucket) =>
  Object.entries(bucket)
    .sort((a, b) => b[1].size - a[1].size)
    .map(([k, files]) => `  ${k}  (${files.size} file${files.size === 1 ? '' : 's'}: ${[...files].slice(0, 3).join(', ')}${files.size > 3 ? ', …' : ''})`)
    .join('\n') || '  none';
console.log(`${CHECK ? '[check] ' : ''}pages: ${report.pages}, meta.json: ${metas.size}, sidebarTitle added: ${report.sidebarTitles}, {placeholders} escaped: ${report.escaped}, duplicate H1 dropped: ${report.droppedH1}`);
console.log(`not in sidebar (built, but no nav entry, same as before): ${report.notInSidebar.join(', ') || 'none'}`);
console.log(`unknown components:\n${fmt(report.unknownComponents)}`);
console.log(`unknown code-fence meta:\n${fmt(report.unknownFenceMeta)}`);
console.log(`raw HTML tags (FYI):\n${fmt(report.rawHtml)}`);
