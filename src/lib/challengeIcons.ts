import path from 'node:path'

import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

const ICONS = ['downtime', 'cost', 'error', 'inconsistent'] as const
const TABLES = ['solution_categories_challenges_items', '_solution_categories_v_version_challenges_items']

/**
 * One-off, after migration 20261029_090753: the Challenges icon used to be a
 * choice of four built-in icons; now it is an upload. Each built-in icon in use
 * is uploaded to Media once, the items get it, and the old column goes.
 * Runs on CMS start (not in the migration) because the CI job that migrates
 * can't reach the media storage. Does nothing once the old column is gone.
 */
export async function migrateChallengeIcons(payload: Payload): Promise<void> {
  const db = payload.db.drizzle
  const { rows } = await db.execute(sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'solution_categories_challenges_items' AND column_name IN ('icon', 'icon_image_id')`)
  // Before the migration (no icon_image_id) or already done (no icon).
  if (rows.length !== 2) return

  try {
    for (const icon of ICONS) {
      const used = await db.execute(sql`
        SELECT 1 FROM solution_categories_challenges_items WHERE icon = ${icon} AND icon_image_id IS NULL
        UNION ALL
        SELECT 1 FROM _solution_categories_v_version_challenges_items WHERE icon = ${icon} AND icon_image_id IS NULL
        LIMIT 1`)
      if (!used.rows.length) continue
      const media = await payload.create({
        collection: 'media',
        data: { alt: '' },
        filePath: path.join(process.cwd(), 'public', 'challenge-icons', `${icon}.svg`),
      })
      for (const table of TABLES) {
        await db.execute(
          sql`UPDATE ${sql.identifier(table)} SET icon_image_id = ${media.id} WHERE icon = ${icon} AND icon_image_id IS NULL`,
        )
      }
    }
    await db.execute(sql`
      ALTER TABLE "solution_categories_challenges_items" DROP COLUMN "icon";
      ALTER TABLE "_solution_categories_v_version_challenges_items" DROP COLUMN "icon";
      DROP TYPE IF EXISTS "public"."enum_solution_categories_challenges_items_icon";
      DROP TYPE IF EXISTS "public"."enum__solution_categories_v_version_challenges_items_icon";`)
    payload.logger.info('Challenges: built-in icons moved to Media.')
  } catch (error) {
    // The old column stays, so the next start tries again; the CMS itself keeps working.
    payload.logger.error({ err: error }, 'Challenges: moving the built-in icons to Media failed')
  }
}
