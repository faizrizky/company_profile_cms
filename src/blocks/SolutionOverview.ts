import type { Block } from 'payload'

import { backgroundFields, sectionHeaderField } from '@/fields/section'

/** Tabs and product cards come from the Solution Categories & Products collections. */
export const SolutionOverviewBlock: Block = {
  slug: 'solutionOverview',
  interfaceName: 'SolutionOverviewBlock',
  labels: { singular: 'Solution Overview', plural: 'Solution Overviews' },
  fields: [sectionHeaderField(), ...backgroundFields()],
}
