import type { Block } from 'payload'

import { buttonsField } from '@/fields/link'
import { backgroundFields } from '@/fields/section'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'home',
      options: [
        { label: 'Home — rata kiri + logo partner', value: 'home' },
        { label: 'Centered — rata tengah', value: 'centered' },
        { label: 'Page — rata kiri dengan pill', value: 'page' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      maxLength: 120,
      admin: { condition: (_, s) => s?.variant !== 'home' },
    },
    { name: 'title', type: 'textarea', required: true, maxLength: 200, admin: { rows: 2 } },
    { name: 'description', type: 'textarea', maxLength: 400, admin: { rows: 3 } },
    ...backgroundFields({ mobile: true, required: true }),
    buttonsField(),
    {
      type: 'row',
      fields: [
        {
          name: 'showPartners',
          type: 'checkbox',
          label: 'Tampilkan marquee logo partner',
          admin: { condition: (_, s) => s?.variant === 'home' },
        },
        {
          name: 'partnerTooltip',
          type: 'checkbox',
          defaultValue: true,
          label: 'Tampilkan keterangan partner saat logo di-hover',
          admin: { condition: (_, s) => s?.variant === 'home' && s?.showPartners },
        },
        {
          name: 'showCertificates',
          type: 'checkbox',
          label: 'Tampilkan tombol "Show Certificate"',
          admin: { condition: (_, s) => s?.variant !== 'home' },
        },
        {
          name: 'showScrollHint',
          type: 'checkbox',
          label: 'Tampilkan ikon scroll',
          defaultValue: true,
        },
      ],
    },
  ],
}
