import type { Block } from 'payload'

import { backgroundFields, sectionHeaderField } from '@/fields/section'

export const CertificationsBlock: Block = {
  slug: 'certifications',
  interfaceName: 'CertificationsBlock',
  labels: { singular: 'Certifications', plural: 'Certifications' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: 'Cards — ikon + deskripsi', value: 'cards' },
        { label: 'Gallery — foto sertifikat (bisa diperbesar)', value: 'gallery' },
      ],
    },
    sectionHeaderField(),
    ...backgroundFields(),
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'certifications',
      hasMany: true,
      maxRows: 6,
      admin: { description: 'Kosongkan untuk menampilkan semua sertifikasi sesuai urutan.' },
    },
  ],
}
