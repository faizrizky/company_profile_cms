import path from 'node:path'
import { fileURLToPath } from 'node:url'

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
    adminThumbnail: 'thumbnail',
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
