import { tools } from './toolCatalog'

/**
 * ---------------------------------------------------------------------------
 * Which tools require a signed-in user with tokens.
 * ---------------------------------------------------------------------------
 *
 * IMPORTANT TRADE-OFF
 * Search engines cannot log in. Any tool listed here will not be indexed by
 * Google, which for a free-tools site is where most traffic comes from.
 *
 * 'all'      every tool is gated (maximum ad impressions, minimum organic reach)
 * 'ai-only'  only the two tools that cost real money per request  <-- recommended
 * 'none'     nothing is gated
 *
 * Change GATE_MODE below to switch. Nothing else needs editing.
 */
export type GateMode = 'all' | 'ai-only' | 'none'

export const GATE_MODE: GateMode = 'all'

/** Tools that hit a paid third-party API on every run. */
export const AI_TOOL_SLUGS = ['remove-bg', 'image-enhancer', 'face-beauty']

export function isToolGated(slug: string): boolean {
  if (GATE_MODE === 'none') return false
  if (GATE_MODE === 'ai-only') return AI_TOOL_SLUGS.includes(slug)
  return true
}

export const gatedToolCount = tools.filter((t) => isToolGated(t.slug)).length

/** Token economy — tweak these numbers in one place. */
export const TOKENS = {
  /** Given once when an account is created. */
  signupBonus: 100,
  /** Spent per tool run. */
  costPerUse: 10,
  /** Earned per completed rewarded ad. */
  rewardPerAd: 50,
  /** Daily free top-up for returning users. */
  dailyBonus: 25,
  /** Max ads a user may watch per day. */
  dailyAdLimit: 10,
} as const
