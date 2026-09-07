import { NextRequest, NextResponse } from 'next/server'
import { enforceAiRateLimit } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 12 * 1024 * 1024 // 12 MB

type Provider = {
  name: string
  key: string | undefined
  run: (file: File, key: string, type: string) => Promise<ArrayBuffer>
}

async function toBuffer(res: Response, name: string): Promise<ArrayBuffer> {
  if (!res.ok) throw new Error(`${name}: ${res.status}`)
  return res.arrayBuffer()
}

const providers: Provider[] = [
  {
    name: 'clipdrop',
    key: process.env.CLIPDROP_API_KEY,
    run: async (file, key) => {
      const form = new FormData()
      form.append('image_file', file, file.name || 'image.jpg')
      form.append('target_width', '2048')
      form.append('target_height', '2048')
      const res = await fetch('https://clipdrop-api.co/image-upscaling/v1/upscale', {
        method: 'POST',
        headers: { 'x-api-key': key },
        body: form,
      })
      return toBuffer(res, 'clipdrop')
    },
  },
  {
    name: 'deepai',
    key: process.env.DEEPAI_API_KEY,
    run: async (file, key, type) => {
      const endpoint =
        type === 'upscale'
          ? 'https://api.deepai.org/api/torch-srgan'
          : 'https://api.deepai.org/api/waifu2x'
      const form = new FormData()
      form.append('image', file, file.name || 'image.jpg')
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'api-key': key },
        body: form,
      })
      if (!res.ok) throw new Error(`deepai: ${res.status}`)
      const data = (await res.json()) as { output_url?: string }
      if (!data.output_url) throw new Error('deepai: no output url')
      return toBuffer(await fetch(data.output_url), 'deepai-result')
    },
  },
  {
    name: 'pixelcut',
    key: process.env.PIXELCUT_API_KEY,
    run: async (file, key, type) => {
      const form = new FormData()
      form.append('image', file, file.name || 'image.jpg')
      form.append('scale', type === 'upscale' ? '4' : '2')
      const res = await fetch('https://api.pixelcut.ai/v1/upscale', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}` },
        body: form,
      })
      return toBuffer(res, 'pixelcut')
    },
  },
]

export async function POST(req: NextRequest) {
  const limit = enforceAiRateLimit(req, 'enhance')
  if (limit.blocked) return limit.response

  const configured = providers.filter((p) => p.key)
  if (configured.length === 0) {
    return NextResponse.json(
      {
        error:
          'AI enhancement is not configured on this server. Set CLIPDROP_API_KEY, DEEPAI_API_KEY or PIXELCUT_API_KEY. The manual adjustment tools still work offline.',
      },
      { status: 503 }
    )
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const file = form.get('image')
  const type = String(form.get('type') || 'upscale')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file provided.' }, { status: 400 })
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Uploaded file is not an image.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image is larger than 12 MB.' }, { status: 413 })
  }
  if (!['upscale', 'denoise', 'sharpen'].includes(type)) {
    return NextResponse.json({ error: 'Unsupported enhancement type.' }, { status: 400 })
  }

  let lastError = 'All enhancement providers failed.'

  for (const provider of configured) {
    try {
      const buf = await provider.run(file, provider.key as string, type)
      return new NextResponse(buf, {
        status: 200,
        headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-store', ...limit.headers },
      })
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Provider error.'
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502, headers: limit.headers })
}
