import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "certifications" ADD COLUMN "icon_hover_id" integer;
  ALTER TABLE "certifications" ADD CONSTRAINT "certifications_icon_hover_id_media_id_fk" FOREIGN KEY ("icon_hover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "certifications_icon_hover_idx" ON "certifications" USING btree ("icon_hover_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "certifications" DROP CONSTRAINT "certifications_icon_hover_id_media_id_fk";
  
  DROP INDEX "certifications_icon_hover_idx";
  ALTER TABLE "certifications" DROP COLUMN "icon_hover_id";`)
}
