import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'

import { hasRole, isAdmin, isAdminOrOwnProfile, isAdminOrSelf, isAuthenticated, publishedOrAuthenticated } from '.'

/** A signed-in CMS user; `verified` = this session passed the 2FA step. */
const user = (roles: string[], verified: boolean) => ({
  id: 7,
  collection: 'users',
  roles,
  totpEnabled: true,
  _sid: 'session-1',
  twoFactor: { verifiedSessions: verified ? ['session-1'] : ['another-session'] },
})

const req = (u: unknown) => ({ req: { user: u } as unknown as PayloadRequest }) as never

describe('access rules require the 2FA step', () => {
  const verifiedAdmin = user(['admin'], true)
  const passwordOnlyAdmin = user(['admin'], false)
  const verifiedEditor = user(['editor'], true)
  const passwordOnlyEditor = user(['editor'], false)

  it('admins only once verified', () => {
    expect(isAdmin(req(verifiedAdmin))).toBe(true)
    expect(isAdmin(req(passwordOnlyAdmin))).toBe(false)
    expect(hasRole(passwordOnlyAdmin as never, 'admin')).toBe(false)
  })

  it('editing content only once verified', () => {
    expect(isAuthenticated(req(verifiedEditor))).toBe(true)
    expect(isAuthenticated(req(passwordOnlyEditor))).toBe(false)
    expect(isAuthenticated(req(null))).toBe(false)
  })

  it('a user without 2FA set up is not signed in', () => {
    expect(isAuthenticated(req({ ...verifiedEditor, totpEnabled: false }))).toBe(false)
  })

  it('drafts only once verified; visitors see published only', () => {
    const publishedOnly = { _status: { equals: 'published' } }
    expect(publishedOrAuthenticated(req(verifiedEditor))).toBe(true)
    expect(publishedOrAuthenticated(req(passwordOnlyEditor))).toEqual(publishedOnly)
    expect(publishedOrAuthenticated(req(null))).toEqual(publishedOnly)
  })

  it('users: own profile before 2FA (so the admin can ask for the code), nothing else', () => {
    expect(isAdminOrOwnProfile(req(passwordOnlyEditor))).toEqual({ id: { equals: 7 } })
    expect(isAdminOrSelf(req(passwordOnlyEditor))).toBe(false)
    expect(isAdminOrSelf(req(verifiedEditor))).toEqual({ id: { equals: 7 } })
    expect(isAdminOrOwnProfile(req(verifiedAdmin))).toBe(true)
  })
})
