import type { GlobalConfig } from 'payload'

import { anyone, isAuthenticated } from '@/access'
import { hrefField, linkFields } from '@/fields/link'
import { imageField } from '@/fields/section'
import { auditGlobal } from '@/hooks/auditLog'
import { revalidateGlobal } from '@/hooks/revalidateFrontend'

const cardFields = [
  { name: 'title', type: 'text', required: true, maxLength: 80 },
  { name: 'description', type: 'text', maxLength: 160 },
  imageField('image', { required: true }),
  hrefField(),
] satisfies GlobalConfig['fields']

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isAuthenticated },
  hooks: { afterChange: [auditGlobal('navigation'), revalidateGlobal('navigation')] },
  fields: [
    {
      name: 'solutionsLabel',
      type: 'text',
      defaultValue: 'Our Solutions',
      maxLength: 40,
    },
    {
      name: 'solutionLinks',
      type: 'array',
      maxRows: 10,
      admin: { description: 'Menu kiri pada mega menu "Our Solutions".' },
      fields: [...linkFields(), { name: 'highlight', type: 'checkbox' }],
    },
    { name: 'featured', type: 'group', label: 'Mega menu — kartu besar', fields: cardFields },
    {
      name: 'cards',
      type: 'array',
      label: 'Mega menu — kartu kecil',
      maxRows: 3,
      fields: cardFields,
    },
    { name: 'links', type: 'array', label: 'Menu lainnya', maxRows: 6, fields: linkFields() },
    { name: 'cta', type: 'group', label: 'Tombol kanan', fields: linkFields() },
  ],
}
