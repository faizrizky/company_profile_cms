import type { Block } from 'payload'

import { hrefField } from '@/fields/link'
import { backgroundFields, imageField, sectionHeaderField } from '@/fields/section'

export const VideoShowcaseBlock: Block = {
  slug: 'videoShowcase',
  interfaceName: 'VideoShowcaseBlock',
  labels: { singular: 'Video Showcase', plural: 'Video Showcases' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    imageField('poster', { required: true }),
    {
      type: 'row',
      fields: [
        { name: 'captionTitle', type: 'text', maxLength: 120 },
        { name: 'captionDescription', type: 'text', maxLength: 240 },
      ],
    },
    hrefField({
      name: 'videoUrl',
      required: false,
      admin: { description: 'Opsional. Link video (https://…) yang dibuka saat tombol play diklik.' },
    }),
  ],
}
