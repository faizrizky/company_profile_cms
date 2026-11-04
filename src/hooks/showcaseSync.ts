import { randomBytes } from 'node:crypto'

import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  PayloadRequest,
  RequestContext,
} from 'payload'

import { slugify } from '@/fields/slug'
import type { Product, SolutionCategory } from '@/payload-types'

/**
 * A category's Showcase tabs and its products are one list seen from two
 * sides (Solution & Product): each tab is one product, linked by the
 * product's `showcaseTab` (the tab's row id).
 *
 * - A new tab gets a new product (a draft), unless an unlinked product of the
 *   category already has its name; renaming the tab renames the product.
 * - A new product (or one moved to another category) gets a tab, the same
 *   way the other round; renaming the product renames the tab.
 * - Removing a tab keeps its product, only unlinked ("Card opens tab" links
 *   it again).
 *
 * Every write here is a draft: nothing goes live until someone publishes.
 * Changes made by this sync don't trigger it again (context flag).
 */

const SYNCING = 'showcaseSync'
/** Set by the product's beforeChange when the product needs a new tab. */
const NEW_TAB = 'showcaseNewTab'
const MAX_TABS = 10

type Tab = NonNullable<NonNullable<SolutionCategory['showcase']>['tabs']>[number]
type NewTab = { categoryId: number; id: string; name: string }

const idOf = (value: unknown): number | undefined =>
  value && typeof value === 'object' ? (value as { id?: number }).id : (value as number | undefined)
const sameName = (a?: string | null, b?: string | null) =>
  (a ?? '').trim().toLowerCase() === (b ?? '').trim().toLowerCase()

/** One language at a time: a save in "all locales" has no single name to sync. */
const localeOf = (req: PayloadRequest) =>
  req.locale && req.locale !== 'all' ? (req.locale as 'en' | 'id') : undefined

const options = (req: PayloadRequest, locale: 'en' | 'id') => ({
  req,
  locale,
  depth: 0,
  draft: true as const,
  overrideAccess: true,
  context: { [SYNCING]: true } as RequestContext,
})

/**
 * A local API call inside this request (same transaction) that leaves the
 * request as it found it: Payload swaps in the call's own context and locale,
 * which would otherwise leak into the rest of the outer save.
 */
async function inner<T>(req: PayloadRequest, run: () => Promise<T>): Promise<T> {
  const { context, locale, fallbackLocale } = req
  try {
    return await run()
  } finally {
    Object.assign(req, { context, locale, fallbackLocale })
  }
}

async function productsOf(req: PayloadRequest, locale: 'en' | 'id', categoryId: number) {
  const { docs } = await inner(req, () =>
    req.payload.find({
      collection: 'products',
      where: { category: { equals: categoryId } },
      pagination: false,
      ...options(req, locale),
    }),
  )
  return docs
}

/** The title's slug, numbered when another product already has it (slugs are unique). */
async function freeSlug(req: PayloadRequest, title: string) {
  const base = slugify(title) || 'product'
  for (let n = 1; ; n++) {
    const slug = n === 1 ? base : `${base}-${n}`
    const { totalDocs } = await inner(req, () =>
      req.payload.count({
        collection: 'products',
        where: { slug: { equals: slug } },
        req,
        overrideAccess: true,
      }),
    )
    if (!totalDocs) return slug
  }
}

/** Category saved: its tabs create, rename and unlink products. */
export const syncProductsFromTabs: CollectionAfterChangeHook<SolutionCategory> = async ({
  doc,
  req,
  context,
}) => {
  const locale = localeOf(req)
  if (context[SYNCING] || !locale) return doc

  const tabs = doc.showcase?.tabs ?? []
  const tabIds = new Set(tabs.map((tab) => tab.id).filter(Boolean))
  const products = await productsOf(req, locale, doc.id)
  const update = (id: number, data: Partial<Product>) =>
    inner(req, () =>
      req.payload.update({ collection: 'products', id, data, ...options(req, locale) }),
    )

  // A removed tab: its product stays, unlinked.
  for (const product of products) {
    if (product.showcaseTab && !tabIds.has(product.showcaseTab)) {
      await update(product.id, { showcaseTab: null })
      product.showcaseTab = null
    }
  }

  for (const tab of tabs) {
    const name = tab.name?.trim()
    if (!tab.id || !name) continue
    const linked = products.find((product) => product.showcaseTab === tab.id)
    if (linked) {
      if (linked.title !== name) await update(linked.id, { title: name })
      continue
    }
    const unlinked = products.find(
      (product) => !product.showcaseTab && sameName(product.title, name),
    )
    if (unlinked) {
      await update(unlinked.id, { showcaseTab: tab.id })
      unlinked.showcaseTab = tab.id
      continue
    }
    const slug = await freeSlug(req, name)
    const created = await inner(req, () =>
      req.payload.create({
        collection: 'products',
        // A draft: the card needs an image before it can be published.
        data: { title: name, slug, category: doc.id, showcaseTab: tab.id, _status: 'draft' },
        ...options(req, locale),
      }),
    )
    products.push(created)
  }
  return doc
}

/**
 * Product about to be saved: a new one, one moved to another category, or one
 * just given its first title, takes the category's unlinked tab of the same
 * name, or a new tab (added after the save, see syncTabFromProduct).
 */
export const linkProductToTab: CollectionBeforeChangeHook<Product> = async ({
  data,
  originalDoc,
  operation,
  req,
  context,
}) => {
  const locale = localeOf(req)
  if (context[SYNCING] || !locale) return data

  const categoryId = idOf(data.category ?? originalDoc?.category)
  const title = (data.title ?? originalDoc?.title)?.trim()
  const moved = operation === 'update' && idOf(originalDoc?.category) !== categoryId
  const firstTitle = operation === 'update' && !originalDoc?.title?.trim()
  // A tab picked by hand in this save wins.
  const picked = data.showcaseTab && data.showcaseTab !== originalDoc?.showcaseTab
  if (!categoryId || !title || picked || !(operation === 'create' || moved || firstTitle))
    return data

  // Its tab in the old category stays there, unlinked.
  if (moved) data.showcaseTab = null
  if (!moved && (data.showcaseTab ?? originalDoc?.showcaseTab)) return data

  const category = await inner(req, () =>
    req.payload.findByID({
      collection: 'solution-categories',
      id: categoryId,
      ...options(req, locale),
    }),
  )
  const tabs = category.showcase?.tabs ?? []
  const taken = new Set(
    (await productsOf(req, locale, categoryId))
      .filter((product) => product.id !== originalDoc?.id)
      .map((product) => product.showcaseTab),
  )
  const match = tabs.find((tab) => tab.id && !taken.has(tab.id) && sameName(tab.name, title))
  if (match?.id) {
    data.showcaseTab = match.id
  } else if (tabs.length < MAX_TABS) {
    // Row ids are ObjectId-like hex strings; this one is ours, so the link holds before the tab exists.
    const id = randomBytes(12).toString('hex')
    data.showcaseTab = id
    context[NEW_TAB] = { categoryId, id, name: title } satisfies NewTab
  }
  return data
}

/** Product saved: add the tab it was given, or rename its tab to its new title. */
export const syncTabFromProduct: CollectionAfterChangeHook<Product> = async ({
  doc,
  previousDoc,
  req,
  context,
}) => {
  const locale = localeOf(req)
  if (context[SYNCING] || !locale) return doc

  const added = context[NEW_TAB] as NewTab | undefined
  delete context[NEW_TAB]
  const categoryId = idOf(doc.category)
  const title = doc.title?.trim()
  const renamed = Boolean(doc.showcaseTab && title && previousDoc?.title !== doc.title)
  if (!categoryId || !title || (!added && !renamed)) return doc

  const category = await inner(req, () =>
    req.payload.findByID({
      collection: 'solution-categories',
      id: categoryId,
      ...options(req, locale),
    }),
  )
  const tabs: Tab[] = [...(category.showcase?.tabs ?? [])]
  if (added && added.categoryId === categoryId) {
    if (tabs.some((tab) => tab.id === added.id)) return doc
    tabs.push({ id: added.id, name: added.name })
  } else {
    const index = tabs.findIndex((tab) => tab.id === doc.showcaseTab)
    if (index < 0 || tabs[index].name === title) return doc
    tabs[index] = { ...tabs[index], name: title }
  }
  await inner(req, () =>
    req.payload.update({
      collection: 'solution-categories',
      id: categoryId,
      data: { showcase: { ...category.showcase, tabs } },
      ...options(req, locale),
    }),
  )
  return doc
}

/** "Card opens tab": one product per tab. Checked on publish (drafts skip validation). */
export async function oneProductPerTab(
  value: string | null | undefined,
  { req, data, id }: { req: PayloadRequest; data: Partial<Product>; id?: number | string },
): Promise<string | true> {
  const categoryId = idOf(data?.category)
  // In the browser there is no database to ask; the server checks on save.
  if (!value || !categoryId || typeof req?.payload?.find !== 'function') return true
  const { docs } = await inner(req, () =>
    req.payload.find({
      collection: 'products',
      where: {
        and: [
          { showcaseTab: { equals: value } },
          { category: { equals: categoryId } },
          ...(id ? [{ id: { not_equals: id } }] : []),
        ],
      },
      limit: 1,
      depth: 0,
      draft: true,
      req,
      overrideAccess: true,
    }),
  )
  return docs.length ? `Tab ini sudah dipakai produk "${docs[0].title}". Pilih tab lain.` : true
}
