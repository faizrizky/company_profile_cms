import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated, publishedOrAuthenticated } from '@/access'
import { pageBlocks } from '@/blocks'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection } from '@/hooks/revalidateFrontend'
import { env } from '@/lib/env'

const audit = auditCollection('pages')
const revalidate = revalidateCollection('pages')

/** Routes owned by the frontend that a CMS page must never shadow. */
const RESERVED_SLUGS = new Set(['api', 'admin', '_next', 'solution-category'])

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    description: 'Susun halaman dari section (blocks). Slug "home" = halaman utama.',
  },
  access: {
    read: publishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  versions: {
    drafts: { autosave: { interval: 2000 }, schedulePublish: true },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [...audit.afterChange, ...revalidate.afterChange],
    afterDelete: [...audit.afterDelete, ...revalidate.afterDelete],
  },
  fields: [
    {
      name: 'editVisual',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: {
            path: '/components/admin/EditVisualButton#EditVisualButton',
            clientProps: { frontendUrl: env.FRONTEND_URL },
          },
        },
      },
    },
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    slugField('title', { reserved: RESERVED_SLUGS }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
              required: true,
              minRows: 1,
              admin: { initCollapsed: true },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
