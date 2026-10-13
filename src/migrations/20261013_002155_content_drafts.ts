import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

/**
 * With drafts on, the admin lists and edit views read the newest *version* of
 * each document. Documents from before have none, so the lists would be empty:
 * give each one a published version of what it is now (every language).
 */
export async function backfillVersions(payload: Payload, req?: PayloadRequest) {
  const slugs: CollectionSlug[] = ['partners', 'certifications', 'products']
  for (const collection of slugs) {
    const { docs } = await payload.find({
      collection,
      locale: 'all',
      depth: 0,
      pagination: false,
      draft: false,
      overrideAccess: true,
      req,
    })
    for (const doc of docs) {
      const { totalDocs } = await payload.countVersions({
        collection,
        where: { parent: { equals: doc.id } },
        req,
      })
      if (totalDocs) continue
      const { createdAt, updatedAt } = doc as { createdAt: string; updatedAt: string }
      await payload.db.createVersion({
        collectionSlug: collection,
        parent: doc.id,
        versionData: { ...doc, _status: 'published' },
        autosave: false,
        createdAt,
        updatedAt,
        req,
        returning: false,
      })
    }
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_partners_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_certifications_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__certifications_v_version_icon_shape" AS ENUM('square', 'wide', 'narrow');
  CREATE TYPE "public"."enum__certifications_v_version_certificate_focus" AS ENUM('center', 'top');
  CREATE TYPE "public"."enum__certifications_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__certifications_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "_partners_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_name" varchar,
  	"version_website" varchar,
  	"version_show_in_hero" boolean DEFAULT true,
  	"version_logo_id" integer,
  	"version_logo_hover_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__partners_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__partners_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_partners_v_locales" (
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_certifications_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_icon_id" integer,
  	"version_icon_hover_id" integer,
  	"version_icon_shape" "enum__certifications_v_version_icon_shape" DEFAULT 'square',
  	"version_certificate_id" integer,
  	"version_certificate_focus" "enum__certifications_v_version_certificate_focus" DEFAULT 'center',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__certifications_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__certifications_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_certifications_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_category_id" integer,
  	"version_showcase_tab" varchar,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_image_mobile_id" integer,
  	"version_layout_wide" boolean,
  	"version_layout_large_title" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  ALTER TABLE "partners" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "certifications" ALTER COLUMN "icon_id" DROP NOT NULL;
  ALTER TABLE "certifications_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "products_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "partners" ADD COLUMN "_status" "enum_partners_status" DEFAULT 'draft';
  ALTER TABLE "certifications" ADD COLUMN "_status" "enum_certifications_status" DEFAULT 'draft';
  ALTER TABLE "products" ADD COLUMN "_status" "enum_products_status" DEFAULT 'draft';
  -- Everything already on the website stays published.
  UPDATE "partners" SET "_status" = 'published';
  UPDATE "certifications" SET "_status" = 'published';
  UPDATE "products" SET "_status" = 'published';
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_parent_id_partners_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v" ADD CONSTRAINT "_partners_v_version_logo_hover_id_media_id_fk" FOREIGN KEY ("version_logo_hover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_v_locales" ADD CONSTRAINT "_partners_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_partners_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_certifications_v" ADD CONSTRAINT "_certifications_v_parent_id_certifications_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."certifications"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certifications_v" ADD CONSTRAINT "_certifications_v_version_icon_id_media_id_fk" FOREIGN KEY ("version_icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certifications_v" ADD CONSTRAINT "_certifications_v_version_icon_hover_id_media_id_fk" FOREIGN KEY ("version_icon_hover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certifications_v" ADD CONSTRAINT "_certifications_v_version_certificate_id_media_id_fk" FOREIGN KEY ("version_certificate_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_certifications_v_locales" ADD CONSTRAINT "_certifications_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_certifications_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_solution_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."solution_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_image_mobile_id_media_id_fk" FOREIGN KEY ("version_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_texts" ADD CONSTRAINT "_products_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_partners_v_parent_idx" ON "_partners_v" USING btree ("parent_id");
  CREATE INDEX "_partners_v_version_version__order_idx" ON "_partners_v" USING btree ("version__order");
  CREATE INDEX "_partners_v_version_version_logo_idx" ON "_partners_v" USING btree ("version_logo_id");
  CREATE INDEX "_partners_v_version_version_logo_hover_idx" ON "_partners_v" USING btree ("version_logo_hover_id");
  CREATE INDEX "_partners_v_version_version_updated_at_idx" ON "_partners_v" USING btree ("version_updated_at");
  CREATE INDEX "_partners_v_version_version_created_at_idx" ON "_partners_v" USING btree ("version_created_at");
  CREATE INDEX "_partners_v_version_version__status_idx" ON "_partners_v" USING btree ("version__status");
  CREATE INDEX "_partners_v_created_at_idx" ON "_partners_v" USING btree ("created_at");
  CREATE INDEX "_partners_v_updated_at_idx" ON "_partners_v" USING btree ("updated_at");
  CREATE INDEX "_partners_v_snapshot_idx" ON "_partners_v" USING btree ("snapshot");
  CREATE INDEX "_partners_v_published_locale_idx" ON "_partners_v" USING btree ("published_locale");
  CREATE INDEX "_partners_v_latest_idx" ON "_partners_v" USING btree ("latest");
  CREATE INDEX "_partners_v_autosave_idx" ON "_partners_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_partners_v_locales_locale_parent_id_unique" ON "_partners_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_certifications_v_parent_idx" ON "_certifications_v" USING btree ("parent_id");
  CREATE INDEX "_certifications_v_version_version__order_idx" ON "_certifications_v" USING btree ("version__order");
  CREATE INDEX "_certifications_v_version_version_icon_idx" ON "_certifications_v" USING btree ("version_icon_id");
  CREATE INDEX "_certifications_v_version_version_icon_hover_idx" ON "_certifications_v" USING btree ("version_icon_hover_id");
  CREATE INDEX "_certifications_v_version_version_certificate_idx" ON "_certifications_v" USING btree ("version_certificate_id");
  CREATE INDEX "_certifications_v_version_version_updated_at_idx" ON "_certifications_v" USING btree ("version_updated_at");
  CREATE INDEX "_certifications_v_version_version_created_at_idx" ON "_certifications_v" USING btree ("version_created_at");
  CREATE INDEX "_certifications_v_version_version__status_idx" ON "_certifications_v" USING btree ("version__status");
  CREATE INDEX "_certifications_v_created_at_idx" ON "_certifications_v" USING btree ("created_at");
  CREATE INDEX "_certifications_v_updated_at_idx" ON "_certifications_v" USING btree ("updated_at");
  CREATE INDEX "_certifications_v_snapshot_idx" ON "_certifications_v" USING btree ("snapshot");
  CREATE INDEX "_certifications_v_published_locale_idx" ON "_certifications_v" USING btree ("published_locale");
  CREATE INDEX "_certifications_v_latest_idx" ON "_certifications_v" USING btree ("latest");
  CREATE INDEX "_certifications_v_autosave_idx" ON "_certifications_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_certifications_v_locales_locale_parent_id_unique" ON "_certifications_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version__order_idx" ON "_products_v" USING btree ("version__order");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_image_idx" ON "_products_v" USING btree ("version_image_id");
  CREATE INDEX "_products_v_version_version_image_mobile_idx" ON "_products_v" USING btree ("version_image_mobile_id");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_texts_order_parent" ON "_products_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_products_v_texts_locale_parent" ON "_products_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "partners__status_idx" ON "partners" USING btree ("_status");
  CREATE INDEX "certifications__status_idx" ON "certifications" USING btree ("_status");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");`)

  await backfillVersions(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_partners_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_partners_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_certifications_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_certifications_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_texts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_partners_v" CASCADE;
  DROP TABLE "_partners_v_locales" CASCADE;
  DROP TABLE "_certifications_v" CASCADE;
  DROP TABLE "_certifications_v_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_texts" CASCADE;
  DROP INDEX "partners__status_idx";
  DROP INDEX "certifications__status_idx";
  DROP INDEX "products__status_idx";
  ALTER TABLE "partners" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "partners" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "certifications" ALTER COLUMN "icon_id" SET NOT NULL;
  ALTER TABLE "certifications_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "products_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "partners" DROP COLUMN "_status";
  ALTER TABLE "certifications" DROP COLUMN "_status";
  ALTER TABLE "products" DROP COLUMN "_status";
  DROP TYPE "public"."enum_partners_status";
  DROP TYPE "public"."enum__partners_v_version_status";
  DROP TYPE "public"."enum__partners_v_published_locale";
  DROP TYPE "public"."enum_certifications_status";
  DROP TYPE "public"."enum__certifications_v_version_icon_shape";
  DROP TYPE "public"."enum__certifications_v_version_certificate_focus";
  DROP TYPE "public"."enum__certifications_v_version_status";
  DROP TYPE "public"."enum__certifications_v_published_locale";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";`)
}
