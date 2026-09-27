import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

import { isTwoFactorVerified } from '@/auth/twoFactorState'
import type { User } from '@/payload-types'

export type Role = User['roles'][number]

/**
 * The request's user, but only once their session passed the second login
 * step (two-factor). Every rule below goes through it, so a password alone
 * never grants access — not through the admin, the API or the visual editor.
 */
export const signedIn = (user: PayloadRequest['user']) => (user && isTwoFactorVerified(user) ? user : null)

export const hasRole = (user: PayloadRequest['user'], role: Role): boolean => {
  const u = signedIn(user)
  return Boolean(u && 'roles' in u && u.roles?.includes(role))
}

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')

/** Any signed-in CMS user (admin or editor). */
export const isAuthenticated: Access = ({ req }) => Boolean(signedIn(req.user))

export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true
  const user = signedIn(req.user)
  if (!user) return false
  return { id: { equals: user.id } } satisfies Where
}

/**
 * Admins: every user. Anyone else: only their own profile — even before the
 * second login step, so the admin knows who is signed in and can ask for
 * the code (reading one's own name/email/roles grants nothing else).
 */
export const isAdminOrOwnProfile: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } } satisfies Where
}

/**
 * Public visitors only ever see published documents. Drafts, scheduled
 * changes and version history stay behind authentication.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (signedIn(req.user)) return true
  return { _status: { equals: 'published' } } satisfies Where
}

export const anyone: Access = () => true

export const nobody: Access = () => false
