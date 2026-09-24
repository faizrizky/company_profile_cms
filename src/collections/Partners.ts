import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isAuthenticated } from '@/access'
import { fieldCard } from '@/fields/card'
import { hrefField } from '@/fields/link'
import { imageField } from '@/fields/section'
import { auditCollection } from '@/hooks/auditLog'
import { revalidateCollection } from '@/hooks/revalidateFrontend'

const audit = auditCollection('partners')
const revalidate = revalidateCollection('partners')

export const Partners: CollectionConfig = {
  slug: 'partners',
  orderable: true,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'logo', 'updatedAt'], group: 'Content' },
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
    fieldCard({ en: 'Partner', id: 'Partner' }, [
      { name: 'name', type: 'text', required: true, maxLength: 120 },
      hrefField({ name: 'website', required: false }),
      {
        name: 'showInHero',
        type: 'checkbox',
        defaultValue: true,
        label: 'Tampilkan di marquee Hero halaman utama',
      },
    ]),
    fieldCard({ en: 'Logo', id: 'Logo' }, [imageField('logo', { required: true })]),
  ],
}
