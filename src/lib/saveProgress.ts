import type {
  CollectionConfig,
  GlobalConfig,
  PayloadRequest,
} from 'payload'

/**
 * Real save progress. A save through /api/falah-save (see
 * endpoints/saveWithProgress.ts) puts a reporter on `req.context`; the hooks
 * below and the frontend revalidation call it as each stage actually runs.
 *
 * Stages, in Payload's order: `beforeValidate` hooks (preparing),
 * `beforeChange` hooks, after which Payload validates the fields and writes
 * to the database (writing), `afterChange` (saved), then the website refresh.
 */
export type SaveStage = 'preparing' | 'writing' | 'saved' | 'revalidating'

const ORDER: Record<SaveStage, number> = { preparing: 1, writing: 2, saved: 3, revalidating: 4 }
const KEY = 'falahSaveProgress'

type Reporter = { slug: string; last: number; send: (stage: SaveStage) => void }

export function attachProgress(req: PayloadRequest, slug: string, send: (stage: SaveStage) => void) {
  req.context = { ...req.context, [KEY]: { slug, last: 0, send } satisfies Reporter }
}

/**
 * Reports `stage` for the document being saved. Other documents touched on
 * the way (e.g. the audit log entry) are ignored, and a stage is only ever
 * reported once, in order.
 */
export function reportProgress(req: PayloadRequest | undefined, slug: string | null, stage: SaveStage) {
  const reporter = req?.context?.[KEY] as Reporter | undefined
  if (!reporter || (slug !== null && reporter.slug !== slug)) return
  if (ORDER[stage] <= reporter.last) return
  reporter.last = ORDER[stage]
  reporter.send(stage)
}

/** Adds the progress hooks to a collection: preparing, validation + write, saved. */
export function withProgressHooks(collection: CollectionConfig): CollectionConfig {
  const { slug } = collection
  const hooks = collection.hooks ?? {}
  return {
    ...collection,
    hooks: {
      ...hooks,
      beforeValidate: [
        ({ data, req }) => {
          reportProgress(req, slug, 'preparing')
          return data
        },
        ...(hooks.beforeValidate ?? []),
      ],
      beforeChange: [
        ...(hooks.beforeChange ?? []),
        // Last hook before field validation and the database write.
        ({ data, req }) => {
          reportProgress(req, slug, 'writing')
          return data
        },
      ],
      afterChange: [
        // First after the database write, before audit log and revalidation.
        ({ doc, req }) => {
          reportProgress(req, slug, 'saved')
          return doc
        },
        ...(hooks.afterChange ?? []),
      ],
    },
  }
}

/** Same for a global. */
export function withGlobalProgressHooks(global: GlobalConfig): GlobalConfig {
  const { slug } = global
  const hooks = global.hooks ?? {}
  return {
    ...global,
    hooks: {
      ...hooks,
      beforeValidate: [
        ({ data, req }) => {
          reportProgress(req, slug, 'preparing')
          return data
        },
        ...(hooks.beforeValidate ?? []),
      ],
      beforeChange: [
        ...(hooks.beforeChange ?? []),
        ({ data, req }) => {
          reportProgress(req, slug, 'writing')
          return data
        },
      ],
      afterChange: [
        ({ doc, req }) => {
          reportProgress(req, slug, 'saved')
          return doc
        },
        ...(hooks.afterChange ?? []),
      ],
    },
  }
}
