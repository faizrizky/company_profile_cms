import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "display_name" varchar;
  CREATE INDEX "media_display_name_idx" ON "media" USING btree ("display_name");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_display_name_idx";
  ALTER TABLE "media" DROP COLUMN "display_name";`)
}
