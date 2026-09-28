/**
 * Copies media files from the local CMS to the production media library.
 * Only the chosen files are added; nothing else in production changes.
 * Run through scripts/push-media.sh (it points Payload at production).
 *
 *   npm run push:media -- 126 127      # local media ids (see the admin URL)
 *
 * Then pick the files in the production admin ("Choose from existing" or
 * "Replace from library") wherever they should appear.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { getPayload } from 'payload'

import config from '@payload-config'

type LocalMedia = {
  id: number
  filename: string
  alt?: string | null
  url: string
  filesize: number
}

const LOCAL = process.env.LOCAL_CMS_URL ?? 'http://localhost:3001'
const ids = (process.env.MEDIA_IDS ?? '').split(/[\s,]+/).filter(Boolean)
const LIMIT_MB = 50 // Supabase Storage per-object cap

if (ids.length === 0) {
  console.error('Usage: npm run push:media -- <local media id> [more ids…]')
  process.exit(1)
}

async function readLocal(id: string, locale: 'en' | 'id'): Promise<LocalMedia> {
  const res = await fetch(`${LOCAL}/api/media/${id}?depth=0&locale=${locale}`)
  if (!res.ok)
    throw new Error(`Local media ${id} not found (is the local CMS running at ${LOCAL}?)`)
  return res.json()
}

const payload = await getPayload({ config })
const dir = await mkdtemp(join(tmpdir(), 'push-media-'))
let failed = 0

for (const id of ids) {
  try {
    const en = await readLocal(id, 'en')
    const idAlt = (await readLocal(id, 'id')).alt
    const sizeMb = en.filesize / 1024 / 1024
    if (sizeMb > LIMIT_MB)
      throw new Error(`${sizeMb.toFixed(1)} MB is over the ${LIMIT_MB} MB storage limit`)

    // Same file already in production (same alt and size): reuse it.
    const existing = (
      await payload.find({
        collection: 'media',
        where: { and: [{ alt: { equals: en.alt ?? '' } }, { filesize: { equals: en.filesize } }] },
        limit: 1,
        depth: 0,
      })
    ).docs[0]
    if (existing) {
      console.log(`= ${id} ${en.filename} → already in production (id ${existing.id})`)
      continue
    }

    const file = await fetch(new URL(en.url, LOCAL))
    if (!file.ok) throw new Error(`could not download ${en.url}`)
    const path = join(dir, en.filename)
    await writeFile(path, Buffer.from(await file.arrayBuffer()))

    const created = await payload.create({
      collection: 'media',
      data: { alt: en.alt ?? '' },
      filePath: path,
    })
    if (idAlt && idAlt !== en.alt) {
      await payload.update({
        collection: 'media',
        id: created.id,
        locale: 'id',
        data: { alt: idAlt },
      })
    }
    console.log(`✓ ${id} ${en.filename} (${sizeMb.toFixed(1)} MB) → production id ${created.id}`)
  } catch (error) {
    failed++
    console.error(`✗ ${id}: ${(error as Error).message}`)
  }
}

await rm(dir, { recursive: true, force: true })
process.exit(failed ? 1 : 0)
