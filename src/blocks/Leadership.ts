import type { Block } from 'payload'

import { backgroundFields, imageField, sectionHeaderField } from '@/fields/section'

export const LeadershipBlock: Block = {
  slug: 'leadership',
  interfaceName: 'LeadershipBlock',
  labels: { singular: 'Leadership', plural: 'Leadership' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    {
      name: 'leaders',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        imageField('photo', { required: true }),
        { name: 'name', type: 'text', required: true, maxLength: 120 },
        { name: 'roles', type: 'text', hasMany: true, maxRows: 5, admin: { description: 'Contoh: Founder, CEO' } },
        { name: 'bio', type: 'textarea', maxLength: 400 },
      ],
    },
  ],
}
