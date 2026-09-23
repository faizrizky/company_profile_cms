import type { Block } from 'payload'

import { backgroundFields, sectionHeaderField } from '@/fields/section'
import { statFields } from './Expertise'

export const TeamStatsBlock: Block = {
  slug: 'teamStats',
  interfaceName: 'TeamStatsBlock',
  labels: { singular: 'Team Stats', plural: 'Team Stats' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    { name: 'items', type: 'array', minRows: 1, maxRows: 8, fields: statFields },
  ],
}
