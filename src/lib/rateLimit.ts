import { NextRequest } from 'next/server'

/**
 * ---------------------------------------------------------------------------
 * IP-based rate limiting for the paid API routes.
 * ---------------------------------------------------------------------------
 *
 * The tool pages hide the AI tools behind TokenGate, but that only hides UI.
 * Anyone can POST straight to /api/remove-bg with curl and spend our provider
 * credits. This module is the actual protection.
 *
 * SCOPE AND LIMITS OF THIS APPROACH
 * The counters live in memory, which means:
 *   - they reset on every deploy and whenever the host recycles the process
 *   - each serverless instance keeps its own counter, so on a platform that
 *     scales out, the effective limit is (limit x number of instances)
 *   - a determined attacker can rotate IPs
 *
 * That is fine for now: it stops casual scripted abuse and accidental loops,
 * which is what actually drains an API budget early on. When the app moves to
 * a real backend, swap the Map for the database or Upstash Redis and the rest
 * of this file can stay as it is.
 */

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Stop the Map growing without bound on a long-lived server. */
const MAX_TRACKED_IPS = 10_000

function sweep(now: number) {
  if (buckets.size < MAX_TRACKED_IPS) return

  // Array.from keeps this compatible with the es5 target in tsconfig.
  const expired: string[] = []
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) expired.push(key)
  })
  expired.forEach((key) => buckets.delete(key))

  // Still too big after removing expired entries: drop the oldest.
  if (buckets.size >= MAX_TRACKED_IPS) {
    const excess = buckets.size - Math.floor(MAX_TRACKED_IPS * 0.8)
    Array.from(buckets.keys())
      .slice(0, excess)
      .forEach((key) => buckets.delete(key))
  }
}

/**
 * Best-effort client IP.
 *
 * On Vercel, x-forwarded-for is set by the platform and its FIRST entry is the
 * real client. Reading the last entry, or trusting a header the client can set
 * freely, would let anyone bypass the limit by sending their own header.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  /** Unix ms when the window resets. */
  resetAt: number
  /** Seconds until reset, for the Retry-After header. */
  retryAfter: number
}

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  sweep(now)

  const existing = buckets.get(identifier)

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs
    buckets.set(identifier, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: limit - 1,
      limit,
      resetAt,
      retryAfter: 0,
    }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetAt: existing.resetAt,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: limit - existing.count,
    limit,
    resetAt: existing.resetAt,
    retryAfter: 0,
  }
}

/** Standard headers so clients can back off politely. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
  if (!result.allowed) headers['Retry-After'] = String(result.retryAfter)
  return headers
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/**
 * Limits for the paid AI routes.
 * Override with env vars without touching code.
 */
export const AI_LIMITS = {
  perHour: Number(process.env.AI_RATE_LIMIT_HOUR || 5),
  perDay: Number(process.env.AI_RATE_LIMIT_DAY || 15),
} as const

/**
 * Applies both the hourly and daily limit for a paid route.
 * Returns null when the request may proceed, or a ready-to-return Response.
 */
export function enforceAiRateLimit(req: NextRequest, route: string) {
  const ip = getClientIp(req)

  const daily = checkRateLimit(`${route}:day:${ip}`, AI_LIMITS.perDay, DAY)
  if (!daily.allowed) {
    return {
      blocked: true as const,
      response: buildLimitResponse(daily, 'today'),
    }
  }

  const hourly = checkRateLimit(`${route}:hour:${ip}`, AI_LIMITS.perHour, HOUR)
  if (!hourly.allowed) {
    return {
      blocked: true as const,
      response: buildLimitResponse(hourly, 'this hour'),
    }
  }

  return { blocked: false as const, headers: rateLimitHeaders(hourly) }
}

function buildLimitResponse(result: RateLimitResult, period: string) {
  const minutes = Math.ceil(result.retryAfter / 60)
  const wait =
    minutes < 60
      ? `${minutes} minute${minutes === 1 ? '' : 's'}`
      : `${Math.ceil(minutes / 60)} hour${Math.ceil(minutes / 60) === 1 ? '' : 's'}`

  return Response.json(
    {
      error: `You have used all ${result.limit} free runs ${period}. Please try again in about ${wait}.`,
      rateLimited: true,
      retryAfter: result.retryAfter,
    },
    { status: 429, headers: rateLimitHeaders(result) }
  )
}
