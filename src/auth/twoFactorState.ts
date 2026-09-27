/**
 * Two-factor state of a CMS user and the check every access rule uses.
 * Dependency-free on purpose: imported by `@/access`. Setup and the login
 * step live in `twoFactor.ts`.
 */

/** Stored on the user (`twoFactor` field, unreadable through the API). */
export type TwoFactorState = {
  /** Encrypted secret of the active setup. */
  secret?: string
  /** Encrypted secret waiting for its first code (setup in progress). */
  pendingSecret?: string
  /** SHA-256 of the unused recovery codes. */
  recoveryCodes?: string[]
  /** Login sessions (Payload session ids) that passed the second step. */
  verifiedSessions?: string[]
  /** Last accepted time step: a code can't be used twice. */
  lastStep?: number
  failures?: number
  lockedUntil?: string
}

export type TwoFactorUser = {
  id: number | string
  email?: string
  collection?: string
  _sid?: string
  totpEnabled?: boolean | null
  twoFactor?: unknown
  sessions?: { id: string }[] | null
}

export const stateOf = (user: TwoFactorUser): TwoFactorState =>
  user.twoFactor && typeof user.twoFactor === 'object' ? (user.twoFactor as TwoFactorState) : {}

/** Signed in *and* past the second step for this session. */
export function isTwoFactorVerified(user: unknown): boolean {
  const u = user as TwoFactorUser | null | undefined
  if (!u) return false
  // Only CMS users log in with a password; anything else is not ours to gate.
  if (u.collection !== 'users') return true
  if (!u.totpEnabled || !u._sid) return false
  return Boolean(stateOf(u).verifiedSessions?.includes(u._sid))
}
