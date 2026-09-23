import type { Block } from 'payload'

import { sectionHeaderField } from '@/fields/section'

export const PartnersBlock: Block = {
  slug: 'partners',
  interfaceName: 'PartnersBlock',
  labels: { singular: 'Partner Logos', plural: 'Partner Logos' },
  fields: [
    sectionHeaderField(),
    {
      name: 'rowOne',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      required: true,
      label: 'Baris 1 (bergerak ke kiri)',
    },
    {
      name: 'rowTwo',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      label: 'Baris 2 (bergerak ke kanan)',
    },
  ],
}
