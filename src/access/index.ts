import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

import type { User } from '@/payload-types'

export type Role = User['roles'][number]

export const hasRole = (user: PayloadRequest['user'], role: Role): boolean =>
  Boolean(user && 'roles' in user && user.roles?.includes(role))

export const isAdmin: Access = ({ req }) => hasRole(req.user, 'admin')

export const isAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')

/** Any signed-in CMS user (admin or editor). */
export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const isAdminOrSelf: Access = ({ req }) => {
  if (hasRole(req.user, 'admin')) return true
  if (!req.user) return false
  return { id: { equals: req.user.id } } satisfies Where
}

/**
 * Public visitors only ever see published documents. Drafts, scheduled
 * changes and version history stay behind authentication.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } } satisfies Where
}

export const anyone: Access = () => true

export const nobody: Access = () => false
