import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories" ADD COLUMN "show_in_mega_menu" boolean DEFAULT true;
  ALTER TABLE "_solution_categories_v" ADD COLUMN "version_show_in_mega_menu" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories" DROP COLUMN "show_in_mega_menu";
  ALTER TABLE "_solution_categories_v" DROP COLUMN "version_show_in_mega_menu";`)
}
