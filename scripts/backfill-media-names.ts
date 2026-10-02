/**
 * Gives media uploaded before readable names existed a display name: its alt
 * text (or "file-<id>") plus the real extension; duplicates get -1, -2…
 * Safe to re-run: files that already have a name are skipped.
 *
 *   npx payload run scripts/backfill-media-names.ts
 * (point DATABASE_URL at production the same way as scripts/push-media.sh)
 */
import { getPayload } from 'payload'

import config from '@payload-config'

const payload = await getPayload({ config })
const all = await payload.find({
  collection: 'media',
  limit: 5000,
  pagination: false,
  depth: 0,
  sort: 'id',
  locale: 'en',
})

const taken = new Set(all.docs.map((d) => (d.displayName ?? '').toLowerCase()).filter(Boolean))
let named = 0

for (const doc of all.docs) {
  if (doc.displayName) continue
  const ext = (doc.filename ?? '').split('.').pop() || 'bin'
  const base =
    (doc.alt ?? '')
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f<>:"|?*/\\]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120) || `file-${doc.id}`
  let name = `${base}.${ext}`
  for (let n = 1; taken.has(name.toLowerCase()); n++) name = `${base}-${n}.${ext}`
  taken.add(name.toLowerCase())
  // Straight to the database: no upload, no hooks, no website refresh.
  await payload.db.updateOne({ collection: 'media', id: doc.id, data: { displayName: name }, returning: false })
  named++
  console.log(`${doc.id}\t${name}`)
}
console.log(`named ${named} of ${all.docs.length}`)
process.exit(0)
