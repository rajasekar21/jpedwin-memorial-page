import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

const LAST_MODIFIED = new Date('2026-05-12');

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;

  // Single-page site: only the canonical root URL belongs in the sitemap.
  // Hash fragments (#about, #timeline…) are not crawlable as separate pages.
  return [
    {
      url: `${base}/`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 1.0
    }
  ];
}
