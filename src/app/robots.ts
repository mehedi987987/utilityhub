import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/tools'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/signup', '/account', '/earn-tokens'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
