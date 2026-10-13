/**
 * Gives partners, certifications and products from before drafts existed a
 * published version, so they show in the admin. The migration
 * 20261013_002155_content_drafts does this itself; this is for a database
 * whose schema was dev-pushed instead. Safe to re-run.
 *
 *   npx payload run scripts/backfill-versions.ts
 */
import { getPayload } from 'payload'

import config from '@payload-config'

import { backfillVersions } from '../src/migrations/20261013_002155_content_drafts'

const payload = await getPayload({ config })
await backfillVersions(payload)
payload.logger.info('Versions backfilled.')
process.exit(0)
