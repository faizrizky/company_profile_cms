import type { TutorialFrame, TutorialRole, TutorialStep } from './steps'

/**
 * The steps are stored as one JSON value (a light editor instead of a Payload
 * array: 28 rows × 12 fields made the settings page take seconds to open).
 * So the server keeps them in shape itself: known keys only, trimmed and
 * capped strings, valid roles and frame, a unique id per step.
 */

const ROLES: TutorialRole[] = ['admin', 'editor']
const LIMITS = { route: 200, target: 400, clickFirst: 400, title: 80, body: 600 }

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

export const MAX_TUTORIAL_STEPS = 150

export function newStepId() {
  return `step-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function normalizeSteps(value: unknown): TutorialStep[] | null {
  if (value == null) return null
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  return value.slice(0, MAX_TUTORIAL_STEPS).flatMap((raw): TutorialStep[] => {
    if (!raw || typeof raw !== 'object') return []
    const s = raw as Record<string, unknown>
    let id = text(s.id, 60).replace(/[^\w-]/g, '') || newStepId()
    if (seen.has(id)) id = newStepId()
    seen.add(id)
    const roles = Array.isArray(s.roles) ? ROLES.filter((r) => (s.roles as unknown[]).includes(r)) : ROLES
    return [
      {
        id,
        enabled: s.enabled !== false,
        roles: roles.length ? roles : ROLES,
        frame: (s.frame === 'editor' ? 'editor' : 'admin') as TutorialFrame,
        route: text(s.route, LIMITS.route),
        target: text(s.target, LIMITS.target),
        clickFirst: text(s.clickFirst, LIMITS.clickFirst),
        titleId: text(s.titleId, LIMITS.title),
        titleEn: text(s.titleEn, LIMITS.title),
        bodyId: text(s.bodyId, LIMITS.body),
        bodyEn: text(s.bodyEn, LIMITS.body),
      },
    ]
  })
}

/** The first problem with the steps, in the admin's language; null when they're fine. */
export function stepsProblem(value: unknown, lang: 'en' | 'id'): string | null {
  if (value == null) return null
  if (!Array.isArray(value)) return lang === 'id' ? 'Format langkah tidak valid.' : 'Invalid steps.'
  if (value.length > MAX_TUTORIAL_STEPS)
    return lang === 'id' ? `Maksimal ${MAX_TUTORIAL_STEPS} langkah.` : `At most ${MAX_TUTORIAL_STEPS} steps.`
  for (const [i, raw] of value.entries()) {
    const s = (raw ?? {}) as Record<string, unknown>
    const n = i + 1
    const missing = (['titleId', 'titleEn', 'bodyId', 'bodyEn'] as const).some(
      (k) => typeof s[k] !== 'string' || !(s[k] as string).trim(),
    )
    if (missing)
      return lang === 'id'
        ? `Langkah ${n}: judul dan teks (Indonesia & Inggris) wajib diisi.`
        : `Step ${n}: the title and text (Indonesian & English) are required.`
    if (Array.isArray(s.roles) && !s.roles.length)
      return lang === 'id' ? `Langkah ${n}: pilih minimal satu role.` : `Step ${n}: choose at least one role.`
  }
  return null
}
