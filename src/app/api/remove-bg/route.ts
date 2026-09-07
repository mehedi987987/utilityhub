import { NextRequest, NextResponse } from 'next/server'
import { enforceAiRateLimit } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 12 * 1024 * 1024 // 12 MB

function getKeys(): string[] {
  return (process.env.REMOVE_BG_API_KEYS || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
}

export async function POST(req: NextRequest) {
  // Rate limit BEFORE doing any work. TokenGate only hides the UI; a direct
  // POST would otherwise spend provider credits with no check at all.
  const limit = enforceAiRateLimit(req, 'remove-bg')
  if (limit.blocked) return limit.response

  const keys = getKeys()
  if (keys.length === 0) {
    return NextResponse.json(
      { error: 'Background removal is not configured on this server. Set REMOVE_BG_API_KEYS.' },
      { status: 503 }
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const file = form.get('image_file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file provided.' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Uploaded file is not an image.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 12 MB.' }, { status: 413 })
  }

  let lastError = 'All API keys failed.'

  for (const key of keys) {
    const upstream = new FormData()
    upstream.append('image_file', file, file.name || 'image.png')
    upstream.append('size', 'auto')

    try {
      const res = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': key },
        body: upstream,
      })

      if (res.ok) {
        const buf = await res.arrayBuffer()
        return new NextResponse(buf, {
          status: 200,
          headers: {
            'Content-Type': res.headers.get('content-type') || 'image/png',
            'Cache-Control': 'no-store',
            ...limit.headers,
          },
        })
      }

      // 402 = out of credits, 429 = rate limited -> try the next key.
      if (res.status !== 402 && res.status !== 429) {
        const text = await res.text()
        return NextResponse.json(
          { error: `Background removal failed (${res.status}).`, detail: text.slice(0, 500) },
          { status: res.status, headers: limit.headers }
        )
      }
      lastError = `Key exhausted (${res.status}).`
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Network error.'
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502, headers: limit.headers })
}
