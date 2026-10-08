import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

import { env } from '@/lib/env'
import { reportProgress } from '@/lib/saveProgress'

/** Cache tags shared with the frontend (see FE `lib/cms/tags.ts`). */
export type CacheTag =
  | 'pages'
  | 'media'
  | 'partners'
  | 'certifications'
  | 'solution-categories'
  | 'products'
  | 'site-settings'
  | 'navigation'
  | 'footer'

async function notifyFrontend(req: PayloadRequest, tags: CacheTag[]) {
  if (req.context?.disableRevalidate) return
  // A save with live progress: the website refresh is its last stage.
  reportProgress(req, null, 'revalidating')

  try {
    const res = await fetch(
      new URL('/api/revalidate', env.FRONTEND_INTERNAL_URL ?? env.FRONTEND_URL),
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.REVALIDATE_SECRET}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(5_000),
      },
    )
    if (!res.ok) {
      req.payload.logger.warn(
        `Frontend revalidation failed (${res.status}) for tags: ${tags.join(', ')}`,
      )
    }
  } catch (error) {
    // Never block an editor's save because the frontend is offline; the
    // next successful save (or a redeploy) refreshes the cache.
    req.payload.logger.warn(
      { err: error },
      `Frontend unreachable, skipped revalidation: ${tags.join(', ')}`,
    )
  }
}

export const revalidateCollection = (tag: CacheTag) => {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
    // Draft autosaves don't change what visitors see.
    const isPublishedChange =
      !('_status' in doc) || doc._status === 'published' || previousDoc?._status === 'published'
    if (isPublishedChange) await notifyFrontend(req, [tag])
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    await notifyFrontend(req, [tag])
    return doc
  }

  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}

export const revalidateGlobal = (tag: CacheTag): GlobalAfterChangeHook => {
  return async ({ doc, req }) => {
    await notifyFrontend(req, [tag])
    return doc
  }
}
