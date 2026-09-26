import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "navigation_link_library_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_link_library_links_locales" (
  	"label" varchar NOT NULL,
  	"target" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_link_library" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_link_library_locales" (
  	"group" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "navigation_link_library_links" ADD CONSTRAINT "navigation_link_library_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_link_library"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_link_library_links_locales" ADD CONSTRAINT "navigation_link_library_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_link_library_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_link_library" ADD CONSTRAINT "navigation_link_library_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_link_library_locales" ADD CONSTRAINT "navigation_link_library_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_link_library"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_link_library_links_order_idx" ON "navigation_link_library_links" USING btree ("_order");
  CREATE INDEX "navigation_link_library_links_parent_id_idx" ON "navigation_link_library_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_link_library_links_locales_locale_parent_id_uniqu" ON "navigation_link_library_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_link_library_order_idx" ON "navigation_link_library" USING btree ("_order");
  CREATE INDEX "navigation_link_library_parent_id_idx" ON "navigation_link_library" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_link_library_locales_locale_parent_id_unique" ON "navigation_link_library_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "navigation_link_library_links" CASCADE;
  DROP TABLE "navigation_link_library_links_locales" CASCADE;
  DROP TABLE "navigation_link_library" CASCADE;
  DROP TABLE "navigation_link_library_locales" CASCADE;`)
}
