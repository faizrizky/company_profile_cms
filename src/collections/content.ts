import type { Access, CollectionConfig } from 'payload'

import { anyone, isAdmin, isAuthenticated } from '@/access'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection, type CacheTag } from '@/hooks/revalidateFrontend'

/**
 * Shared setup of the website's content collections (pages, media, partners…):
 * signed-in editors create and edit, only admins delete, and every change is
 * audit-logged and refreshes the website.
 */
export function contentAccess(read: Access = anyone): CollectionConfig['access'] {
  return { read, create: isAuthenticated, update: isAuthenticated, delete: isAdmin }
}

/** Audit log + website revalidation after every change or delete. */
export function contentHooks(
  slug: CacheTag,
): Pick<NonNullable<CollectionConfig['hooks']>, 'afterChange' | 'afterDelete'> {
  const audit = auditCollection(slug)
  const revalidate = revalidateCollection(slug)
  return {
    afterChange: [...audit.afterChange, ...revalidate.afterChange],
    afterDelete: [...audit.afterDelete, ...revalidate.afterDelete],
  }
}
