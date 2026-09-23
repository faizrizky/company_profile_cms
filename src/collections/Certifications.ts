import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAuthenticated } from '@/access'
import { imageField } from '@/fields/section'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection } from '@/hooks/revalidateFrontend'

const audit = auditCollection('certifications')
const revalidate = revalidateCollection('certifications')

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  orderable: true,
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'subtitle', 'updatedAt'], group: 'Content' },
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
    { name: 'subtitle', type: 'text', maxLength: 120 },
    { name: 'description', type: 'textarea', maxLength: 400 },
    {
      type: 'row',
      fields: [
        imageField('icon', { required: true, admin: { width: '50%' } }),
        {
          name: 'iconShape',
          type: 'select',
          defaultValue: 'square',
          admin: { width: '50%' },
          options: [
            { label: 'Square', value: 'square' },
            { label: 'Wide', value: 'wide' },
            { label: 'Narrow', value: 'narrow' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        imageField('certificate', { required: true, label: 'Certificate image', admin: { width: '50%' } }),
        {
          name: 'certificateFocus',
          type: 'select',
          defaultValue: 'center',
          admin: { width: '50%' },
          options: [
            { label: 'Center', value: 'center' },
            { label: 'Top', value: 'top' },
          ],
        },
      ],
    },
  ],
}
