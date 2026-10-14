import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

/**
 * Site settings get drafts: the admin reads the newest *version*, the website
 * only what is published. The settings that exist are published already, so
 * they are marked so (the website would get nothing otherwise) and get a first
 * version of what they are now, in every language.
 */
export async function backfillSiteSettingsVersion(payload: Payload, req?: PayloadRequest) {
  const { totalDocs } = await payload.countGlobalVersions({ global: 'site-settings', req })
  if (totalDocs) return
  const doc = await payload.findGlobal({
    slug: 'site-settings',
    locale: 'all',
    depth: 0,
    draft: false,
    overrideAccess: true,
    req,
  })
  if (!doc?.id) return
  const { createdAt, updatedAt } = doc as { createdAt: string; updatedAt: string }
  await payload.db.createGlobalVersion({
    globalSlug: 'site-settings',
    versionData: { ...doc, _status: 'published' },
    autosave: false,
    createdAt,
    updatedAt,
    req,
    returning: false,
  })
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_version_socials_platform" AS ENUM('facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'x', 'whatsapp', 'other');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "_site_settings_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__site_settings_v_version_socials_platform" DEFAULT 'other',
  	"url" varchar,
  	"icon_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_version_socials_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_logo_id" integer,
  	"version_contact_latitude" numeric,
  	"version_contact_longitude" numeric,
  	"version_contact_email" varchar,
  	"version_contact_phone" varchar,
  	"version_contact_whatsapp_number" varchar,
  	"version_email_notifications_enabled" boolean DEFAULT true,
  	"version_email_notifications_from_name" varchar DEFAULT 'Falah Website',
  	"version_email_notifications_from_email" varchar DEFAULT 'noreply@falahtech.co.id',
  	"version_email_notifications_subject" varchar DEFAULT 'Konsultasi baru dari {name} ({organization})',
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_settings_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_site_settings_v_locales" (
  	"version_site_name" varchar,
  	"version_site_description" varchar,
  	"version_contact_address" varchar,
  	"version_contact_short_address" varchar,
  	"version_contact_whatsapp_message" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings_socials" ALTER COLUMN "platform" DROP NOT NULL;
  ALTER TABLE "site_settings_socials" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "site_settings_socials_locales" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "logo_id" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "email_notifications_from_email" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "email_notifications_subject" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "site_name" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "site_description" DROP NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "contact_address" DROP NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "_status" "enum_site_settings_status" DEFAULT 'draft';
  -- What the website shows today stays published.
  UPDATE "site_settings" SET "_status" = 'published';
  ALTER TABLE "_site_settings_v_version_socials" ADD CONSTRAINT "_site_settings_v_version_socials_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_socials" ADD CONSTRAINT "_site_settings_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_socials_locales" ADD CONSTRAINT "_site_settings_v_version_socials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_version_socials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_locales" ADD CONSTRAINT "_site_settings_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_site_settings_v_version_socials_order_idx" ON "_site_settings_v_version_socials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_socials_parent_id_idx" ON "_site_settings_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_socials_icon_idx" ON "_site_settings_v_version_socials" USING btree ("icon_id");
  CREATE UNIQUE INDEX "_site_settings_v_version_socials_locales_locale_parent_id_un" ON "_site_settings_v_version_socials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_snapshot_idx" ON "_site_settings_v" USING btree ("snapshot");
  CREATE INDEX "_site_settings_v_published_locale_idx" ON "_site_settings_v" USING btree ("published_locale");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  CREATE INDEX "_site_settings_v_autosave_idx" ON "_site_settings_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_site_settings_v_locales_locale_parent_id_unique" ON "_site_settings_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");`)

  await backfillSiteSettingsVersion(payload, req)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_site_settings_v_version_socials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_socials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_site_settings_v_version_socials" CASCADE;
  DROP TABLE "_site_settings_v_version_socials_locales" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TABLE "_site_settings_v_locales" CASCADE;
  DROP INDEX "site_settings__status_idx";
  ALTER TABLE "site_settings_socials" ALTER COLUMN "platform" SET NOT NULL;
  ALTER TABLE "site_settings_socials" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "site_settings_socials_locales" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "logo_id" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_email" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "contact_phone" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "email_notifications_from_email" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "email_notifications_subject" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "site_name" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "site_description" SET NOT NULL;
  ALTER TABLE "site_settings_locales" ALTER COLUMN "contact_address" SET NOT NULL;
  ALTER TABLE "site_settings" DROP COLUMN "_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_version_socials_platform";
  DROP TYPE "public"."enum__site_settings_v_version_status";
  DROP TYPE "public"."enum__site_settings_v_published_locale";`)
}
