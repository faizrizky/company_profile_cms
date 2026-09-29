import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" ADD COLUMN "partner_tooltip" boolean DEFAULT true;
  ALTER TABLE "pages_blocks_partners" ADD COLUMN "show_tooltip" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "partner_tooltip" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_partners" ADD COLUMN "show_tooltip" boolean DEFAULT false;
  ALTER TABLE "partners" ADD COLUMN "logo_hover_id" integer;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_hover_id_media_id_fk" FOREIGN KEY ("logo_hover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "partners_logo_hover_idx" ON "partners" USING btree ("logo_hover_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "partners" DROP CONSTRAINT "partners_logo_hover_id_media_id_fk";
  
  DROP INDEX "partners_logo_hover_idx";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "partner_tooltip";
  ALTER TABLE "pages_blocks_partners" DROP COLUMN "show_tooltip";
  ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "partner_tooltip";
  ALTER TABLE "_pages_v_blocks_partners" DROP COLUMN "show_tooltip";
  ALTER TABLE "partners" DROP COLUMN "logo_hover_id";`)
}
