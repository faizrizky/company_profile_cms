import type { Block } from 'payload'

import { backgroundFields, iconCardFields, imageField, sectionHeaderField } from '@/fields/section'

export const ProblemShowcaseBlock: Block = {
  slug: 'problemShowcase',
  interfaceName: 'ProblemShowcaseBlock',
  labels: { singular: 'Problem Showcase', plural: 'Problem Showcases' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: iconCardFields,
      admin: { description: 'Item dengan deskripsi akan tampil lebih menonjol.' },
    },
    imageField('image', { required: true }),
  ],
}
