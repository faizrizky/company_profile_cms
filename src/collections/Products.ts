import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAuthenticated } from '@/access'
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
    description: 'Kartu produk di Solution Overview. Geser untuk mengatur urutan.',
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
    { name: 'title', type: 'text', required: true, maxLength: 120 },
    slugField(),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'solution-categories',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        imageField('image', { required: true, admin: { width: '50%' } }),
        imageField('imageMobile', { label: 'Image (mobile)', admin: { width: '50%' } }),
      ],
    },
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
