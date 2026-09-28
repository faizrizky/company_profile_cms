import type { CollectionConfig } from 'payload'

import { contentAccess, contentHooks } from '@/collections/content'
import { fieldCard } from '@/fields/card'
import { imageField } from '@/fields/section'
import { slugField } from '@/fields/slug'

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
  access: contentAccess(),
  hooks: contentHooks('products'),
  fields: [
    fieldCard({ en: 'Content', id: 'Konten' }, [
      { name: 'title', type: 'text', required: true, maxLength: 120 },
      {
        name: 'summary',
        type: 'textarea',
        maxLength: 300,
        admin: {
          description: {
            en: 'Short description: "Our Solutions" mega menu and the card on hover.',
            id: 'Deskripsi singkat: mega menu "Our Solutions" dan kartu saat di-hover.',
          },
        },
      },
      {
        name: 'tags',
        type: 'text',
        hasMany: true,
        maxRows: 6,
        admin: {
          description: {
            en: '"Recommended For" chips, shown on the card on hover.',
            id: 'Chip "Recommended For", tampil di kartu saat di-hover.',
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
      {
        name: 'showcaseTab',
        type: 'text',
        // Tab row ids are the same in every language.
        localized: false,
        label: { en: 'Card opens tab', id: 'Kartu membuka tab' },
        admin: {
          description: {
            en: 'Clicking the card opens the category page at this Showcase tab.',
            id: 'Klik kartu membuka halaman kategori di tab Showcase ini.',
          },
          components: { Field: '/components/admin/ShowcaseTabField#ShowcaseTabField' },
        },
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
