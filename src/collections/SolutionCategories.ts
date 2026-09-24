import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated, publishedOrAuthenticated } from '@/access'
import { fieldCard } from '@/fields/card'
import { hrefField } from '@/fields/link'
import { imageField } from '@/fields/section'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection } from '@/hooks/revalidateFrontend'

const audit = auditCollection('solution-categories')
const revalidate = revalidateCollection('solution-categories')

export const SolutionCategories: CollectionConfig = {
  slug: 'solution-categories',
  labels: { singular: 'Solution Category', plural: 'Solution Categories' },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Solutions',
    description: 'Setiap kategori punya halaman detail di /solution/<slug>. Geser untuk mengatur urutan tab.',
  },
  access: {
    read: publishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  versions: { drafts: { autosave: { interval: 2000 } }, maxPerDoc: 30 },
  hooks: {
    afterChange: [...audit.afterChange, ...revalidate.afterChange],
    afterDelete: [...audit.afterDelete, ...revalidate.afterDelete],
  },
  fields: [
    fieldCard({ en: 'General', id: 'Umum' }, [
      { name: 'title', type: 'text', required: true, maxLength: 80 },
    ]),
    slugField(),
    {
      name: 'hasDetailPage',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktifkan halaman detail',
      admin: { position: 'sidebar', description: 'Nonaktifkan bila konten detail belum siap (halaman akan 404).' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'title', type: 'text', maxLength: 120, admin: { description: 'Kosongkan = judul kategori.' } },
                { name: 'description', type: 'textarea', maxLength: 300 },
                imageField('image'),
                { name: 'recommendedFor', type: 'text', hasMany: true, maxRows: 6 },
              ],
            },
          ],
        },
        {
          label: 'Challenges',
          fields: [
            {
              name: 'challenges',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', defaultValue: 'The Challenges', maxLength: 60 },
                { name: 'title', type: 'textarea', maxLength: 200 },
                { name: 'description', type: 'textarea', maxLength: 400 },
                {
                  name: 'items',
                  type: 'array',
                  maxRows: 8,
                  fields: [
                    {
                      name: 'icon',
                      type: 'select',
                      required: true,
                      defaultValue: 'downtime',
                      options: [
                        { label: 'Clock (downtime)', value: 'downtime' },
                        { label: 'Coins (cost)', value: 'cost' },
                        { label: 'User X (human error)', value: 'error' },
                        { label: 'Shuffle (inconsistent)', value: 'inconsistent' },
                      ],
                    },
                    { name: 'title', type: 'text', required: true, maxLength: 120 },
                    { name: 'description', type: 'textarea', maxLength: 300 },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Showcase',
          fields: [
            {
              name: 'showcase',
              type: 'group',
              fields: [
                imageField('background'),
                {
                  name: 'brochure',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: 'PDF brosur. Kosongkan = tombol mengarah ke halaman contact.' },
                },
                {
                  name: 'tabs',
                  type: 'array',
                  maxRows: 10,
                  fields: [
                    { name: 'name', type: 'text', required: true, maxLength: 80 },
                    { name: 'description', type: 'textarea', maxLength: 400 },
                    { name: 'tags', type: 'text', hasMany: true, maxRows: 8 },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text', maxLength: 80 },
                { name: 'title', type: 'text', maxLength: 160 },
                { name: 'description', type: 'textarea', maxLength: 300 },
                imageField('background'),
                {
                  type: 'row',
                  fields: [
                    { name: 'buttonLabel', type: 'text', defaultValue: 'Request Consultation', maxLength: 60 },
                    hrefField({ name: 'buttonHref', defaultValue: '/contact' }),
                  ],
                },
              ],
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
