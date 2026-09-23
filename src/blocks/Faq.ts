import type { Block } from 'payload'

import { backgroundFields, sectionHeaderField } from '@/fields/section'

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 20,
      fields: [
        { name: 'question', type: 'text', required: true, maxLength: 200 },
        { name: 'answer', type: 'textarea', required: true, maxLength: 1000 },
      ],
    },
  ],
}
