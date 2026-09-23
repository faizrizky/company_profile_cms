import type { Block } from 'payload'

import { backgroundFields, sectionHeaderField } from '@/fields/section'

/** The address and map pin come from Site Settings → Contact. */
export const OfficeMapBlock: Block = {
  slug: 'officeMap',
  interfaceName: 'OfficeMapBlock',
  labels: { singular: 'Office Map', plural: 'Office Maps' },
  fields: [sectionHeaderField(), ...backgroundFields()],
}
