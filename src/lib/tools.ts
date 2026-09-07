import { tools } from './toolCatalog'

/** Every tool slug, derived from the single source of truth in toolCatalog. */
export const TOOL_SLUGS = tools.map((t) => t.slug)

export const STATIC_PATHS = ['/', '/about', '/privacy', '/contact'] as const

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}
