import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { syncCategoryProducts } from '@/hooks/showcaseSync'

/**
 * Existing Showcase tabs get their product (Solution & Product: one product per
 * tab), without anyone having to save each category first: a product named
 * like the tab is linked, otherwise a draft product is made. English first (it
 * names new products), then Indonesian (their Indonesian titles). Once only:
 * a product deleted later isn't made again.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.payload ??= payload
  for (const locale of ['en', 'id'] as const) {
    req.locale = locale
    const { docs } = await payload.find({
      collection: 'solution-categories',
      draft: true,
      depth: 0,
      locale,
      pagination: false,
      overrideAccess: true,
      req,
    })
    for (const category of docs) await syncCategoryProducts(req, locale, category)
  }
}

// The products stay: they are content now, removed by hand if unwanted.
export async function down(_args: MigrateDownArgs): Promise<void> {}
