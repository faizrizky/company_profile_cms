import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_solution_highlights_items_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "_pages_v_blocks_solution_highlights_items_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "partners" ADD COLUMN "description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_solution_highlights_items_locales" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_solution_highlights_items_locales" DROP COLUMN "description";
  ALTER TABLE "partners" DROP COLUMN "description";`)
}
