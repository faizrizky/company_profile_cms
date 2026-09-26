import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { env } from '@/lib/env'
import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAuthenticated } from '@/access'
import { fieldCard } from '@/fields/card'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection } from '@/hooks/revalidateFrontend'
import { ALLOWED_MIME_TYPES, secureUpload } from '@/hooks/secureUpload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const audit = auditCollection('media')
const revalidate = revalidateCollection('media')

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'] },
  access: {
    read: anyone,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  hooks: {
    beforeOperation: [secureUpload],
    afterChange: [...audit.afterChange, ...revalidate.afterChange],
    afterDelete: [...audit.afterDelete, ...revalidate.afterDelete],
  },
  upload: {
    mimeTypes: ALLOWED_MIME_TYPES,
    // Outside src/ and public/: files are only reachable through Payload's access-checked route.
    staticDir: path.resolve(dirname, '../../media'),
    imageSizes: [
      { name: 'thumbnail', width: 480 },
      { name: 'card', width: 960 },
      { name: 'hero', width: 1920 },
    ],
    // The size's own URL: with public storage that is the bucket/CDN, so the
    // admin doesn't stream every thumbnail through the CMS.
    // Straight from the public bucket/CDN, so the admin doesn't stream every
    // thumbnail through the CMS. (Built from the file name: this runs before
    // the storage plugin fills in the public URLs.)
    adminThumbnail: ({ doc }) => {
      // Videos / PDFs get Payload's file icon.
      if (typeof doc.mimeType !== 'string' || !doc.mimeType.startsWith('image/')) return null
      const sizes = doc.sizes as Record<string, { filename?: string | null } | undefined> | undefined
      const filename = sizes?.thumbnail?.filename || (typeof doc.filename === 'string' ? doc.filename : null)
      if (!filename) return null
      const base = env.S3_PUBLIC_URL && /^https?:/.test(env.S3_PUBLIC_URL) ? env.S3_PUBLIC_URL : null
      return base ? `${base}/${encodeURIComponent(filename)}` : `/api/media/file/${encodeURIComponent(filename)}`
    },
    focalPoint: true,
  },
  fields: [
    fieldCard({ en: 'Details', id: 'Detail' }, [
      {
        name: 'alt',
        type: 'text',
        maxLength: 200,
        admin: { description: 'Teks alternatif untuk aksesibilitas & SEO. Kosongkan untuk gambar dekoratif.' },
      },
    ]),
  ],
}
