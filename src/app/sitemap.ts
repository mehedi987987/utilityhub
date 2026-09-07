import type { MetadataRoute } from 'next'
import { TOOL_SLUGS, STATIC_PATHS, getSiteUrl } from '@/lib/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const lastModified = new Date()

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${base}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : path === '/faq' ? 0.7 : 0.5,
    })),
    ...TOOL_SLUGS.map((slug) => ({
      url: `${base}/tools/${slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
