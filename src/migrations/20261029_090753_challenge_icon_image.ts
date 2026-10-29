import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories_challenges_items" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "_solution_categories_v_version_challenges_items" ADD COLUMN "icon_image_id" integer;
  ALTER TABLE "solution_categories_challenges_items" ADD CONSTRAINT "solution_categories_challenges_items_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solution_categories_v_version_challenges_items" ADD CONSTRAINT "_solution_categories_v_version_challenges_items_icon_image_id_media_id_fk" FOREIGN KEY ("icon_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "solution_categories_challenges_items_icon_image_idx" ON "solution_categories_challenges_items" USING btree ("icon_image_id");
  CREATE INDEX "_solution_categories_v_version_challenges_items_icon_ima_idx" ON "_solution_categories_v_version_challenges_items" USING btree ("icon_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "solution_categories_challenges_items" DROP CONSTRAINT "solution_categories_challenges_items_icon_image_id_media_id_fk";
  
  ALTER TABLE "_solution_categories_v_version_challenges_items" DROP CONSTRAINT "_solution_categories_v_version_challenges_items_icon_image_id_media_id_fk";
  
  DROP INDEX "solution_categories_challenges_items_icon_image_idx";
  DROP INDEX "_solution_categories_v_version_challenges_items_icon_ima_idx";
  ALTER TABLE "solution_categories_challenges_items" DROP COLUMN "icon_image_id";
  ALTER TABLE "_solution_categories_v_version_challenges_items" DROP COLUMN "icon_image_id";`)
}
