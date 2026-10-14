import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { GlobalSlug, Payload, PayloadRequest } from 'payload'

/**
 * Navigation and footer get drafts, like the site settings (see
 * 20261014_090051_site_settings_drafts): what exists is published already, so
 * it is marked so and gets a first version of what it is now, in every language.
 */
export async function backfillGlobalVersions(payload: Payload, req?: PayloadRequest) {
  const slugs: GlobalSlug[] = ['navigation', 'footer']
  for (const slug of slugs) {
    const { totalDocs } = await payload.countGlobalVersions({ global: slug, req })
    if (totalDocs) continue
    const doc = await payload.findGlobal({
      slug,
      locale: 'all',
      depth: 0,
      draft: false,
      overrideAccess: true,
      req,
    })
    if (!doc?.id) continue
    const { createdAt, updatedAt } = doc as { createdAt: string; updatedAt: string }
    await payload.db.createGlobalVersion({
      globalSlug: slug,
      versionData: { ...doc, _status: 'published' },
      autosave: false,
      createdAt,
      updatedAt,
      req,
      returning: false,
    })
  }
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__navigation_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_footer_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__footer_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "_navigation_v_version_solution_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"highlight" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_solution_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_cards_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"visible" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_link_library_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_link_library_links_locales" (
  	"label" varchar,
  	"target" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v_version_link_library" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v_version_link_library_locales" (
  	"group" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_featured_image_id" integer,
  	"version_featured_href" varchar,
  	"version_cta_href" varchar,
  	"version__status" "enum__navigation_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__navigation_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_navigation_v_locales" (
  	"version_solutions_label" varchar DEFAULT 'Our Solutions',
  	"version_featured_title" varchar,
  	"version_featured_description" varchar,
  	"version_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_columns_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v_version_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_footer_v_version_columns_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__footer_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__footer_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_footer_v_locales" (
  	"version_description" varchar,
  	"version_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "navigation_solution_links" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "navigation_solution_links_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "navigation_cards" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "navigation_cards" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "navigation_cards_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "navigation_links" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "navigation_links_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "navigation_link_library_links_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "navigation_link_library_links_locales" ALTER COLUMN "target" DROP NOT NULL;
  ALTER TABLE "navigation_link_library_locales" ALTER COLUMN "group" DROP NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "featured_image_id" DROP NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "featured_href" DROP NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "cta_href" DROP NOT NULL;
  ALTER TABLE "navigation_locales" ALTER COLUMN "featured_title" DROP NOT NULL;
  ALTER TABLE "navigation_locales" ALTER COLUMN "cta_label" DROP NOT NULL;
  ALTER TABLE "footer_columns_links" ALTER COLUMN "href" DROP NOT NULL;
  ALTER TABLE "footer_columns_links_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "footer_columns_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "navigation" ADD COLUMN "_status" "enum_navigation_status" DEFAULT 'draft';
  ALTER TABLE "footer" ADD COLUMN "_status" "enum_footer_status" DEFAULT 'draft';
  -- What the website shows today stays published.
  UPDATE "navigation" SET "_status" = 'published';
  UPDATE "footer" SET "_status" = 'published';
  ALTER TABLE "_navigation_v_version_solution_links" ADD CONSTRAINT "_navigation_v_version_solution_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_solution_links_locales" ADD CONSTRAINT "_navigation_v_version_solution_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_solution_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_cards" ADD CONSTRAINT "_navigation_v_version_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_cards" ADD CONSTRAINT "_navigation_v_version_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_cards_locales" ADD CONSTRAINT "_navigation_v_version_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_links" ADD CONSTRAINT "_navigation_v_version_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_links_locales" ADD CONSTRAINT "_navigation_v_version_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_link_library_links" ADD CONSTRAINT "_navigation_v_version_link_library_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_link_library"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_link_library_links_locales" ADD CONSTRAINT "_navigation_v_version_link_library_links_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_link_library_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_link_library" ADD CONSTRAINT "_navigation_v_version_link_library_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_link_library_locales" ADD CONSTRAINT "_navigation_v_version_link_library_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v_version_link_library"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v" ADD CONSTRAINT "_navigation_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_navigation_v_locales" ADD CONSTRAINT "_navigation_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links" ADD CONSTRAINT "_footer_v_version_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_links_locales" ADD CONSTRAINT "_footer_v_version_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns" ADD CONSTRAINT "_footer_v_version_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_version_columns_locales" ADD CONSTRAINT "_footer_v_version_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v_version_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_footer_v_locales" ADD CONSTRAINT "_footer_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_footer_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_navigation_v_version_solution_links_order_idx" ON "_navigation_v_version_solution_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_solution_links_parent_id_idx" ON "_navigation_v_version_solution_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_solution_links_locales_locale_parent_i" ON "_navigation_v_version_solution_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_cards_order_idx" ON "_navigation_v_version_cards" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_cards_parent_id_idx" ON "_navigation_v_version_cards" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_cards_image_idx" ON "_navigation_v_version_cards" USING btree ("image_id");
  CREATE UNIQUE INDEX "_navigation_v_version_cards_locales_locale_parent_id_unique" ON "_navigation_v_version_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_links_order_idx" ON "_navigation_v_version_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_links_parent_id_idx" ON "_navigation_v_version_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_links_locales_locale_parent_id_unique" ON "_navigation_v_version_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_link_library_links_order_idx" ON "_navigation_v_version_link_library_links" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_link_library_links_parent_id_idx" ON "_navigation_v_version_link_library_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_link_library_links_locales_locale_pare" ON "_navigation_v_version_link_library_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_link_library_order_idx" ON "_navigation_v_version_link_library" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_link_library_parent_id_idx" ON "_navigation_v_version_link_library" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_navigation_v_version_link_library_locales_locale_parent_id_" ON "_navigation_v_version_link_library_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_navigation_v_version_featured_version_featured_image_idx" ON "_navigation_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_navigation_v_version_version__status_idx" ON "_navigation_v" USING btree ("version__status");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_navigation_v_snapshot_idx" ON "_navigation_v" USING btree ("snapshot");
  CREATE INDEX "_navigation_v_published_locale_idx" ON "_navigation_v" USING btree ("published_locale");
  CREATE INDEX "_navigation_v_latest_idx" ON "_navigation_v" USING btree ("latest");
  CREATE INDEX "_navigation_v_autosave_idx" ON "_navigation_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_navigation_v_locales_locale_parent_id_unique" ON "_navigation_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_columns_links_order_idx" ON "_footer_v_version_columns_links" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_links_parent_id_idx" ON "_footer_v_version_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_columns_links_locales_locale_parent_id_uni" ON "_footer_v_version_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_columns_order_idx" ON "_footer_v_version_columns" USING btree ("_order");
  CREATE INDEX "_footer_v_version_columns_parent_id_idx" ON "_footer_v_version_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_footer_v_version_columns_locales_locale_parent_id_unique" ON "_footer_v_version_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_footer_v_version_version__status_idx" ON "_footer_v" USING btree ("version__status");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_snapshot_idx" ON "_footer_v" USING btree ("snapshot");
  CREATE INDEX "_footer_v_published_locale_idx" ON "_footer_v" USING btree ("published_locale");
  CREATE INDEX "_footer_v_latest_idx" ON "_footer_v" USING btree ("latest");
  CREATE INDEX "_footer_v_autosave_idx" ON "_footer_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_footer_v_locales_locale_parent_id_unique" ON "_footer_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation__status_idx" ON "navigation" USING btree ("_status");
  CREATE INDEX "footer__status_idx" ON "footer" USING btree ("_status");`)

  await backfillGlobalVersions(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_navigation_v_version_solution_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_solution_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_cards_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_link_library_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_link_library_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_link_library" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_version_link_library_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_navigation_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_columns_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_version_columns_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_footer_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_navigation_v_version_solution_links" CASCADE;
  DROP TABLE "_navigation_v_version_solution_links_locales" CASCADE;
  DROP TABLE "_navigation_v_version_cards" CASCADE;
  DROP TABLE "_navigation_v_version_cards_locales" CASCADE;
  DROP TABLE "_navigation_v_version_links" CASCADE;
  DROP TABLE "_navigation_v_version_links_locales" CASCADE;
  DROP TABLE "_navigation_v_version_link_library_links" CASCADE;
  DROP TABLE "_navigation_v_version_link_library_links_locales" CASCADE;
  DROP TABLE "_navigation_v_version_link_library" CASCADE;
  DROP TABLE "_navigation_v_version_link_library_locales" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "_navigation_v_locales" CASCADE;
  DROP TABLE "_footer_v_version_columns_links" CASCADE;
  DROP TABLE "_footer_v_version_columns_links_locales" CASCADE;
  DROP TABLE "_footer_v_version_columns" CASCADE;
  DROP TABLE "_footer_v_version_columns_locales" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "_footer_v_locales" CASCADE;
  DROP INDEX "navigation__status_idx";
  DROP INDEX "footer__status_idx";
  ALTER TABLE "navigation_solution_links" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "navigation_solution_links_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "navigation_cards" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "navigation_cards" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "navigation_cards_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "navigation_links" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "navigation_links_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "navigation_link_library_links_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "navigation_link_library_links_locales" ALTER COLUMN "target" SET NOT NULL;
  ALTER TABLE "navigation_link_library_locales" ALTER COLUMN "group" SET NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "featured_image_id" SET NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "featured_href" SET NOT NULL;
  ALTER TABLE "navigation" ALTER COLUMN "cta_href" SET NOT NULL;
  ALTER TABLE "navigation_locales" ALTER COLUMN "featured_title" SET NOT NULL;
  ALTER TABLE "navigation_locales" ALTER COLUMN "cta_label" SET NOT NULL;
  ALTER TABLE "footer_columns_links" ALTER COLUMN "href" SET NOT NULL;
  ALTER TABLE "footer_columns_links_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "footer_columns_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "navigation" DROP COLUMN "_status";
  ALTER TABLE "footer" DROP COLUMN "_status";
  DROP TYPE "public"."enum_navigation_status";
  DROP TYPE "public"."enum__navigation_v_version_status";
  DROP TYPE "public"."enum__navigation_v_published_locale";
  DROP TYPE "public"."enum_footer_status";
  DROP TYPE "public"."enum__footer_v_version_status";
  DROP TYPE "public"."enum__footer_v_published_locale";`)
}
