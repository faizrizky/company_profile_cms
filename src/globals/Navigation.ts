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
      admin: {
        description: {
          en: 'The mega menu is filled automatically from Solution Categories & Products.',
          id: 'Isi mega menu diambil otomatis dari Solution Categories & Products.',
        },
      },
    },
    // Superseded: the mega menu is now built from Solution Categories and
    // Products. Hidden rather than removed so existing data survives until the
    // columns are dropped in a migration.
    {
      name: 'solutionLinks',
      type: 'array',
      maxRows: 10,
      admin: { hidden: true },
      fields: [...linkFields(), { name: 'highlight', type: 'checkbox' }],
    },
    { name: 'featured', type: 'group', admin: { hidden: true }, fields: cardFields },
    { name: 'cards', type: 'array', maxRows: 3, admin: { hidden: true }, fields: cardFields },
    { name: 'links', type: 'array', label: 'Menu lainnya', maxRows: 6, fields: linkFields() },
    {
      name: 'linkLibrary',
      type: 'array',
      label: { en: 'Links per page', id: 'Link per halaman' },
      labels: { singular: { en: 'Page', id: 'Halaman' }, plural: { en: 'Pages', id: 'Halaman' } },
      admin: {
        description: {
          en: 'Extra link choices for the page editor (e.g. a section #faq, an external site), grouped by page. Pages and solution pages are listed automatically.',
          id: 'Pilihan link tambahan untuk editor halaman (mis. bagian #faq, situs luar), dikelompokkan per halaman. Halaman dan halaman solusi sudah muncul otomatis.',
        },
      },
      fields: [
        { name: 'group', type: 'text', required: true, maxLength: 60, label: { en: 'Page', id: 'Halaman' } },
        {
          name: 'links',
          type: 'array',
          maxRows: 30,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', required: true, maxLength: 80, admin: { width: '50%' } },
                // Free text here: this is where the choices are defined.
                hrefField({ name: 'target', label: { en: 'Link', id: 'Link' }, admin: { width: '50%' } }),
              ],
            },
          ],
        },
      ],
    },
    { name: 'cta', type: 'group', label: 'Tombol kanan', fields: linkFields() },
  ],
}
