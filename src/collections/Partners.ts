import type { CollectionConfig } from 'payload'

import { contentAccess, contentHooks } from '@/collections/content'
import { fieldCard } from '@/fields/card'
import { hrefField } from '@/fields/link'
import { imageField } from '@/fields/section'

export const Partners: CollectionConfig = {
  slug: 'partners',
  orderable: true,
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'logo', 'updatedAt'], group: 'Content' },
  access: contentAccess(),
  hooks: contentHooks('partners'),
  fields: [
    fieldCard({ en: 'Partner', id: 'Partner' }, [
      { name: 'name', type: 'text', required: true, maxLength: 120 },
      {
        name: 'description',
        type: 'textarea',
        maxLength: 200,
        admin: {
          description: {
            en: 'Shown in a card when the logo is hovered.',
            id: 'Tampil dalam kartu saat logo di-hover.',
          },
        },
      },
      hrefField({ name: 'website', required: false }),
      {
        name: 'showInHero',
        type: 'checkbox',
        defaultValue: true,
        label: 'Tampilkan di marquee Hero halaman utama',
      },
    ]),
    fieldCard({ en: 'Logo', id: 'Logo' }, [
      imageField('logo', { required: true }),
      imageField('logoHover', {
        label: { en: 'Logo (hover)', id: 'Logo (hover)' },
        admin: {
          description: {
            en: 'Optional. The original colour logo shown when the logo is hovered.',
            id: 'Opsional. Logo asli berwarna yang tampil saat logo di-hover.',
          },
        },
      }),
    ]),
  ],
}
