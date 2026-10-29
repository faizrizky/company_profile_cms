import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Records that the built-in icon choice is gone. The old `icon` column is not
// dropped here: CI migrates before the CMS restarts, and the CMS first turns
// each choice into an uploaded icon (src/lib/challengeIcons.ts), then drops it.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {}
