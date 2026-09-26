import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAuthenticated } from '@/access'
import { fieldCard } from '@/fields/card'
import { imageField } from '@/fields/section'
import { slugField } from '@/fields/slug'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection } from '@/hooks/revalidateFrontend'

const audit = auditCollection('products')
const revalidate = revalidateCollection('products')

export const Products: CollectionConfig = {
  slug: 'products',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'updatedAt'],
    group: 'Solutions',
    description:
      'Kartu produk di Solution Overview dan mega menu (produk pertama tiap kategori jadi kartu besar). Geser untuk mengatur urutan.',
  },
  access: {
    read: anyone,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [...audit.afterChange, ...revalidate.afterChange],
    afterDelete: [...audit.afterDelete, ...revalidate.afterDelete],
  },
  fields: [
    fieldCard({ en: 'Content', id: 'Konten' }, [
      { name: 'title', type: 'text', required: true, maxLength: 120 },
      {
        name: 'summary',
        type: 'textarea',
        maxLength: 160,
        admin: {
          description: {
            en: 'Short description, shown in the "Our Solutions" mega menu.',
            id: 'Deskripsi singkat, tampil di mega menu "Our Solutions".',
          },
        },
      },
      {
        name: 'category',
        type: 'relationship',
        relationTo: 'solution-categories',
        required: true,
        index: true,
      },
    ]),
    slugField(),
    fieldCard({ en: 'Images', id: 'Gambar' }, [
      {
        type: 'row',
        fields: [
          imageField('image', { required: true, admin: { width: '50%' } }),
          imageField('imageMobile', { label: 'Image (mobile)', admin: { width: '50%' } }),
        ],
      },
    ]),
    {
      name: 'layout',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'wide', type: 'checkbox', label: 'Lebar 2 kolom (desktop)' },
            { name: 'largeTitle', type: 'checkbox', label: 'Judul besar' },
          ],
        },
      ],
    },
  ],
}
