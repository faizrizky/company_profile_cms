import type { Block } from 'payload'

import { buttonsField, hrefField } from '@/fields/link'
import { backgroundFields, imageField, sectionHeaderField, videoField } from '@/fields/section'

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'simple',
      options: [
        { label: 'Simple', value: 'simple' },
        { label: 'Dengan media / video', value: 'withMedia' },
      ],
    },
    sectionHeaderField(),
    ...backgroundFields({ mobile: true, required: true }),
    buttonsField(2),
    imageField('media', { admin: { condition: (_, s) => s?.variant === 'withMedia' } }),
    videoField('video', {
      admin: {
        condition: (_, s) => s?.variant === 'withMedia',
        description: 'Opsional. Video MP4/WebM yang diputar langsung di halaman (gambar Media jadi poster).',
      },
    }),
    hrefField({
      name: 'videoUrl',
      required: false,
      admin: {
        condition: (_, s) => s?.variant === 'withMedia',
        description: 'Opsional. Link video luar (mis. YouTube) — dipakai bila Video di atas kosong.',
      },
    }),
  ],
}
