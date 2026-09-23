import type { Block } from 'payload'

import { hrefField, linkFields } from '@/fields/link'
import { backgroundFields, imageField, sectionHeaderField } from '@/fields/section'

export const SolutionHighlightsBlock: Block = {
  slug: 'solutionHighlights',
  interfaceName: 'SolutionHighlightsBlock',
  labels: { singular: 'Solution Highlights', plural: 'Solution Highlights' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    {
      name: 'featured',
      type: 'group',
      fields: [
        imageField('image', { required: true }),
        { name: 'title', type: 'text', required: true, maxLength: 120 },
        { name: 'description', type: 'textarea', maxLength: 300 },
        { name: 'tagsLabel', type: 'text', defaultValue: 'Recommended For', maxLength: 60 },
        { name: 'tags', type: 'text', hasMany: true, maxRows: 6 },
        { name: 'button', type: 'group', fields: linkFields() },
      ],
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 4,
      fields: [
        imageField('image', { required: true }),
        { name: 'title', type: 'text', required: true, maxLength: 120 },
        hrefField(),
      ],
    },
  ],
}
