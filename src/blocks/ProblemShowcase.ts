import type { Block } from 'payload'

import { backgroundFields, iconCardFields, imageField, sectionHeaderField } from '@/fields/section'

export const ProblemShowcaseBlock: Block = {
  slug: 'problemShowcase',
  interfaceName: 'ProblemShowcaseBlock',
  labels: { singular: 'Problem Showcase', plural: 'Problem Showcases' },
  fields: [
    sectionHeaderField(),
    ...backgroundFields(),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        ...iconCardFields,
        imageField('image', {
          admin: {
            description: {
              en: 'Shown on the right while this item is active. Empty = the section image.',
              id: 'Tampil di kanan saat item ini aktif. Kosong = gambar section.',
            },
          },
        }),
      ],
      admin: {
        description: {
          en: 'Hover or click an item to open it: its description shows and the image switches.',
          id: 'Hover atau klik item untuk membukanya: deskripsinya tampil dan gambarnya berganti.',
        },
      },
    },
    imageField('image', { required: true }),
  ],
}
