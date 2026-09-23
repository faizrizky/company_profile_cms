import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionAfterLoginHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

import { getClientIp, getUserAgent } from '@/lib/request'

type AuditEntry = {
  action: 'create' | 'update' | 'delete' | 'login'
  resource: string
  documentId?: string
  changedFields?: string[]
}

const IGNORED_FIELDS = new Set(['updatedAt', 'createdAt', '_status', 'hash', 'salt', 'sessions'])

function changedFields(doc: Record<string, unknown>, previousDoc?: Record<string, unknown>) {
  if (!previousDoc) return []
  return Object.keys(doc).filter(
    (key) => !IGNORED_FIELDS.has(key) && JSON.stringify(doc[key]) !== JSON.stringify(previousDoc[key]),
  )
}

async function writeAudit(req: PayloadRequest, entry: AuditEntry) {
  if (req.context?.disableAudit) return

  try {
    await req.payload.create({
      collection: 'audit-logs',
      overrideAccess: true,
      req,
      data: {
        ...entry,
        user: req.user?.collection === 'users' ? req.user.id : undefined,
        ip: getClientIp(req.headers),
        userAgent: getUserAgent(req.headers),
      },
    })
  } catch (error) {
    req.payload.logger.error({ err: error }, `Failed to write audit log for ${entry.resource}`)
  }
}

export const auditCollection = (resource: string) => {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
    await writeAudit(req, {
      action: operation,
      resource,
      documentId: String(doc.id),
      changedFields: operation === 'update' ? changedFields(doc, previousDoc) : undefined,
    })
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ id, req }) => {
    await writeAudit(req, { action: 'delete', resource, documentId: String(id) })
  }

  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

export const auditGlobal = (resource: string): GlobalAfterChangeHook => {
  return async ({ doc, previousDoc, req }) => {
    await writeAudit(req, { action: 'update', resource, changedFields: changedFields(doc, previousDoc) })
    return doc
  }
}

export const auditLogin: CollectionAfterLoginHook = async ({ req, user }) => {
  await writeAudit(req, { action: 'login', resource: 'users', documentId: String(user.id) })
  return user
}
