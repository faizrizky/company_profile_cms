import type { CollectionConfig } from 'payload'

import { contentAccess, contentHooks } from '@/collections/content'
import { fieldCard } from '@/fields/card'
import { imageField } from '@/fields/section'

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subtitle', 'updatedAt'],
    group: 'Content',
  },
  access: contentAccess(),
  hooks: contentHooks('certifications'),
  fields: [
    fieldCard({ en: 'Content', id: 'Konten' }, [
      { name: 'title', type: 'text', required: true, maxLength: 120 },
      { name: 'subtitle', type: 'text', maxLength: 120 },
      { name: 'description', type: 'textarea', maxLength: 400 },
    ]),
    fieldCard({ en: 'Icon & certificate', id: 'Ikon & sertifikat' }, [
      {
        type: 'row',
        fields: [
          imageField('icon', { required: true, admin: { width: '50%' } }),
          imageField('iconHover', {
            label: { en: 'Icon (hover)', id: 'Ikon (hover)' },
            admin: {
              width: '50%',
              description: {
                en: 'Optional. Full-colour logo shown when the card is hovered.',
                id: 'Opsional. Logo berwarna yang tampil saat kartu di-hover.',
              },
            },
          }),
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
          imageField('certificate', {
            label: { en: 'Certificate image', id: 'Gambar sertifikat' },
            admin: {
              width: '50%',
              description: {
                en: 'Optional. Without it, the certification is left out of the certificate gallery.',
                id: 'Opsional. Tanpa gambar, sertifikasi tidak tampil di galeri sertifikat.',
              },
            },
          }),
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
    ]),
  ],
}
