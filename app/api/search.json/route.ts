import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

// Pages whose slug starts with `_` (e.g. the /_kitchen-sink/ QA page) are built but not searchable.
const searchable = () => ({
  ...source,
  getPages: (...args: Parameters<typeof source.getPages>) => source.getPages(...args).filter((page) => !page.slugs[0]?.startsWith('_')),
});

// Served as /api/search.json so static hosting sends a JSON content-type (and compresses it).
export const { staticGET: GET } = createFromSource(searchable, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: 'english',
  // Docs search only ranks by relevance; Orama's sort index was ~3 MB of the static index.
  sort: { enabled: false },
});
