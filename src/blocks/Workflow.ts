import type { Block } from 'payload'

import { sectionHeaderField } from '@/fields/section'

export const WorkflowBlock: Block = {
  slug: 'workflow',
  interfaceName: 'WorkflowBlock',
  labels: { singular: 'Workflow Steps', plural: 'Workflow Steps' },
  fields: [
    sectionHeaderField(),
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      admin: { description: 'Nomor (01, 02, …) dibuat otomatis sesuai urutan.' },
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 80 },
        { name: 'description', type: 'textarea', maxLength: 240 },
      ],
    },
  ],
}
