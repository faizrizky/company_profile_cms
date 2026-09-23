import type { GroupField } from 'payload'

import { imageField } from './section'

export const seoField: GroupField = {
  name: 'meta',
  label: 'SEO',
  type: 'group',
  admin: { description: 'Kosongkan untuk memakai judul halaman & deskripsi default situs.' },
  fields: [
    { name: 'title', type: 'text', maxLength: 70 },
    { name: 'description', type: 'textarea', maxLength: 160, admin: { rows: 2 } },
    imageField('image', { label: 'Share image (Open Graph)' }),
  ],
}
