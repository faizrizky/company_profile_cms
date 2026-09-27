import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { contentAccess, contentHooks } from '@/collections/content'
import { env } from '@/lib/env'
import type { CollectionConfig } from 'payload'

import { fieldCard } from '@/fields/card'
import { ALLOWED_MIME_TYPES, secureUpload } from '@/hooks/secureUpload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'] },
  access: contentAccess(),
  hooks: {
    beforeOperation: [secureUpload],
    ...contentHooks('media'),
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
      const sizes = doc.sizes as
        Record<string, { filename?: string | null } | undefined> | undefined
      const filename =
        sizes?.thumbnail?.filename || (typeof doc.filename === 'string' ? doc.filename : null)
      if (!filename) return null
      // Public URL or a proxied path such as /media (local MinIO).
      const base = env.S3_PUBLIC_URL?.replace(/\/$/, '') || null
      return base
        ? `${base}/${encodeURIComponent(filename)}`
        : `/api/media/file/${encodeURIComponent(filename)}`
    },
    focalPoint: true,
  },
  fields: [
    fieldCard({ en: 'Details', id: 'Detail' }, [
      {
        name: 'alt',
        type: 'text',
        maxLength: 200,
        admin: {
          description:
            'Teks alternatif untuk aksesibilitas & SEO. Kosongkan untuk gambar dekoratif.',
        },
      },
    ]),
    // Merged into Payload's own upload field of the same name: only the list
    // cell changes (video previews).
    {
      name: 'filename',
      type: 'text',
      admin: { components: { Cell: '/components/admin/MediaFileCell#MediaFileCell' } },
    },
  ],
}
