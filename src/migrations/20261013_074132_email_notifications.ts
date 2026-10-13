import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "email_notifications_enabled" boolean DEFAULT true;
  ALTER TABLE "site_settings" ADD COLUMN "email_notifications_from_name" varchar DEFAULT 'Falah Website';
  ALTER TABLE "site_settings" ADD COLUMN "email_notifications_from_email" varchar DEFAULT 'noreply@falahtech.co.id' NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "email_notifications_subject" varchar DEFAULT 'Konsultasi baru dari {name} ({organization})' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "email_notifications_enabled";
  ALTER TABLE "site_settings" DROP COLUMN "email_notifications_from_name";
  ALTER TABLE "site_settings" DROP COLUMN "email_notifications_from_email";
  ALTER TABLE "site_settings" DROP COLUMN "email_notifications_subject";`)
}
