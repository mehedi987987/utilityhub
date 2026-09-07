# Work Gate

A collection of 27 free, no-signup online tools — image editing, file conversion,
GPA and Zakat calculators, and everyday utilities. Built with Next.js 14 (App Router),
TypeScript and Tailwind CSS.

Almost every tool runs entirely in the browser using Canvas and the File API, so user
files never leave their device. Only two tools (Remove Background and the AI mode of
Image Enhancer) call an external service, and they do so through a server-side API
route so that API keys are never exposed to the client.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — only needed for the AI-backed tools
npm run dev
```

The app runs at http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler with no emit |

## Environment variables

All of these are optional. Without them the AI-backed tools return a clear
"not configured" message and every other tool keeps working.

| Variable | Used by | Notes |
| --- | --- | --- |
| `REMOVE_BG_API_KEYS` | Remove Background | Comma-separated remove.bg keys; the server rotates to the next one on 402/429 |
| `CLIPDROP_API_KEY` | Image Enhancer (AI) | Tried first |
| `DEEPAI_API_KEY` | Image Enhancer (AI) | Fallback |
| `PIXELCUT_API_KEY` | Image Enhancer (AI) | Fallback |
| `NEXT_PUBLIC_SITE_URL` | `sitemap.xml`, `robots.txt`, canonical URLs | e.g. `https://workgate.example.com` |

These are read on the server only. Never put a secret in a `NEXT_PUBLIC_*` variable.

## Ads and gating

Two settings control monetisation:

**`src/lib/authConfig.ts` — `GATE_MODE`**

| Value | Effect |
| --- | --- |
| `'ai-only'` (current) | Only Remove Background and Image Enhancer need an account. These are the only tools that cost money per run. |
| `'all'` | Every tool needs an account. Maximises ad impressions but the tool pages stop being indexable, which removes most organic traffic. |
| `'none'` | No gating at all. |

**`src/lib/adsConfig.ts`** reads the `NEXT_PUBLIC_ADSTERRA_*` keys. Any slot with
an empty key renders nothing, so the site is safe to deploy before the ad
account is approved. `NEXT_PUBLIC_ADS_ENABLED=false` disables every slot.

Placements: one horizontal rail on the home page, below each tool, on the FAQ
page and on Earn Tokens, plus the Social Bar site-wide. Ads never render on
`/login`, `/signup` or `/account`.

Banner units are rendered inside sandboxed iframes because Adsterra's snippet
uses `document.write` and a global `atOptions`, which break React and collide
when two units share a page.

## Rate limiting

`/api/remove-bg` and `/api/enhance` spend real money at an external provider on
every call. `TokenGate` on the tool pages only hides UI — a direct `POST` would
bypass it entirely — so the actual protection lives in `src/lib/rateLimit.ts`
and runs before any provider request is made.

Defaults are 5 runs per hour and 15 per day per IP, overridable with
`AI_RATE_LIMIT_HOUR` and `AI_RATE_LIMIT_DAY`. Blocked requests get a 429 with
`Retry-After` and `X-RateLimit-*` headers.

The counters are in-process, so they reset on deploy and each serverless
instance keeps its own. That is enough to stop scripted abuse and runaway
loops; when a real database is added, swap the `Map` for a shared store
(the database itself or Upstash Redis) and the rest of the module is unchanged.

## Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── remove-bg/route.ts   # server-side proxy for remove.bg
│   │   └── enhance/route.ts     # server-side proxy for AI upscaling
│   ├── tools/<slug>/
│   │   ├── page.tsx             # the tool itself (client component)
│   │   └── layout.tsx           # per-tool SEO metadata
│   ├── about | contact | privacy
│   ├── layout.tsx  robots.ts  sitemap.ts  not-found.tsx
│   └── page.tsx                 # home page with search + category filter
├── components/                  # Header, Footer, ToolLayout, ErrorBanner
└── lib/
    ├── bookData.ts              # SSC grammar content
    └── tools.ts                 # tool slug list, shared by the sitemap
```

## Adding a tool

1. Create `src/app/tools/<slug>/page.tsx` as a `"use client"` component wrapped in `<ToolLayout>`.
2. Create `src/app/tools/<slug>/layout.tsx` exporting `metadata` with a title and description.
3. Add the tool to the `tools` array in `src/app/page.tsx` with a `cat` matching one of the
   category ids (`education`, `islamic`, `calculators`, `images`, `utilities`).
4. Add the slug to `TOOL_SLUGS` in `src/lib/tools.ts` so it appears in the sitemap.

## Deployment

Deploy as a standard Next.js app (Vercel, or any Node host running `npm run build && npm start`).
Set the environment variables above in the hosting provider's dashboard.
