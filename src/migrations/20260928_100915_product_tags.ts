import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  ALTER TABLE "products_texts" ADD CONSTRAINT "products_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_texts_order_parent" ON "products_texts" USING btree ("order","parent_id");
  CREATE INDEX "products_texts_locale_parent" ON "products_texts" USING btree ("locale","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_texts" CASCADE;`)
}
