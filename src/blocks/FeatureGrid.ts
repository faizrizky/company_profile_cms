import type { Block } from 'payload'

import { backgroundFields, iconCardFields, imageField, sectionHeaderField } from '@/fields/section'

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  interfaceName: 'FeatureGridBlock',
  labels: { singular: 'Feature Grid', plural: 'Feature Grids' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: 'Cards — 3 kolom', value: 'cards' },
        { label: 'Values — 4 kolom dengan kutipan', value: 'values' },
      ],
    },
    sectionHeaderField(),
    ...backgroundFields(),
    imageField('backgroundOverlay', {
      admin: {
        condition: (_, s) => s?.variant === 'values',
        description: 'Layer gambar kedua di atas background.',
      },
    }),
    {
      name: 'quote',
      type: 'text',
      maxLength: 160,
      admin: { condition: (_, s) => s?.variant === 'values' },
    },
    { name: 'items', type: 'array', minRows: 1, maxRows: 8, fields: iconCardFields },
  ],
}
