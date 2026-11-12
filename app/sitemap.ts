import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

export const dynamic = 'force-static';

const site = 'https://doctale.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = source
    .getPages()
    .filter((page) => !page.slugs[0]?.startsWith('_'))
    .map((page) => ({ url: `${site}${page.url.replace(/\/?$/, '/')}`, changeFrequency: 'weekly' as const, priority: 0.7 }));
  return [{ url: `${site}/`, changeFrequency: 'weekly', priority: 1 }, ...pages];
}
