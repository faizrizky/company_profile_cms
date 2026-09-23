import type { Block } from 'payload'

import { backgroundFields, imageField, sectionHeaderField } from '@/fields/section'

export const statFields = [
  {
    type: 'row',
    fields: [
      { name: 'value', type: 'number', required: true, min: 0 },
      { name: 'suffix', type: 'text', maxLength: 20, admin: { description: 'Contoh: +, %, K+ Hour' } },
      { name: 'label', type: 'text', required: true, maxLength: 80 },
    ],
  },
] satisfies Block['fields']

export const ExpertiseBlock: Block = {
  slug: 'expertise',
  interfaceName: 'ExpertiseBlock',
  labels: { singular: 'Expertise + Stats', plural: 'Expertise + Stats' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    { name: 'stats', type: 'array', maxRows: 4, fields: statFields },
    {
      name: 'cards',
      type: 'array',
      maxRows: 6,
      fields: [
        imageField('image', { required: true }),
        imageField('icon', { required: true }),
        { name: 'title', type: 'text', required: true, maxLength: 120 },
        { name: 'description', type: 'textarea', maxLength: 300 },
      ],
    },
  ],
}
