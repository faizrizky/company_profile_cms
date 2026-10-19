import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories_showcase_tabs" ADD COLUMN "brochure_id" integer;
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" ADD COLUMN "brochure_id" integer;
  ALTER TABLE "solution_categories_showcase_tabs" ADD CONSTRAINT "solution_categories_showcase_tabs_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" ADD CONSTRAINT "_solution_categories_v_version_showcase_tabs_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "solution_categories_showcase_tabs_brochure_idx" ON "solution_categories_showcase_tabs" USING btree ("brochure_id");
  CREATE INDEX "_solution_categories_v_version_showcase_tabs_brochure_idx" ON "_solution_categories_v_version_showcase_tabs" USING btree ("brochure_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories_showcase_tabs" DROP CONSTRAINT "solution_categories_showcase_tabs_brochure_id_media_id_fk";
  
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" DROP CONSTRAINT "_solution_categories_v_version_showcase_tabs_brochure_id_media_id_fk";
  
  DROP INDEX "solution_categories_showcase_tabs_brochure_idx";
  DROP INDEX "_solution_categories_v_version_showcase_tabs_brochure_idx";
  ALTER TABLE "solution_categories_showcase_tabs" DROP COLUMN "brochure_id";
  ALTER TABLE "_solution_categories_v_version_showcase_tabs" DROP COLUMN "brochure_id";`)
}
