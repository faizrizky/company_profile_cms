import type { Block, Field } from 'payload'

import { imageField } from '@/fields/section'

import { elementBlocks } from './elements'

const MAX_COLUMNS = 4

const column = (n: number): Field => ({
  name: `column${n}`,
  type: 'blocks',
  label: `Column ${n}`,
  blocks: elementBlocks,
  maxRows: 12,
  admin: { condition: (_, s) => Number(s?.columns ?? 1) >= n, initCollapsed: true },
})

/**
 * Free-form section for the visual editor: 1–4 columns of elements.
 * Responsive by construction: columns stack on mobile, max 2 on tablet.
 */
export const LayoutSectionBlock: Block = {
  slug: 'layoutSection',
  interfaceName: 'LayoutSectionBlock',
  labels: { singular: 'Layout Section', plural: 'Layout Sections' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'columns',
          type: 'select',
          required: true,
          defaultValue: '2',
          options: ['1', '2', '3', '4'].map((v) => ({
            label: `${v} column${v === '1' ? '' : 's'}`,
            value: v,
          })),
        },
        {
          name: 'verticalAlign',
          type: 'select',
          defaultValue: 'center',
          options: [
            { label: 'Top', value: 'start' },
            { label: 'Center', value: 'center' },
          ],
        },
        {
          name: 'gap',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'background',
          type: 'select',
          defaultValue: 'dark',
          options: [
            { label: 'Dark', value: 'dark' },
            { label: 'Darker', value: 'darker' },
            { label: 'Brand gradient', value: 'gradient' },
            { label: 'Image', value: 'image' },
          ],
        },
        {
          name: 'padding',
          type: 'select',
          defaultValue: 'md',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        {
          name: 'width',
          type: 'select',
          defaultValue: 'default',
          options: [
            { label: 'Narrow', value: 'narrow' },
            { label: 'Default', value: 'default' },
            { label: 'Wide', value: 'wide' },
          ],
        },
      ],
    },
    imageField('backgroundImage', { admin: { condition: (_, s) => s?.background === 'image' } }),
    ...Array.from({ length: MAX_COLUMNS }, (_, i) => column(i + 1)),
  ],
}
