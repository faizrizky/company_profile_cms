import type { Field, TextField } from 'payload'

import type { AdminOverrides, LocalizedText } from './section'
import { withTextValidation } from './validate'

/**
 * Only internal paths, anchors, https, mailto and tel are accepted.
 * This blocks `javascript:` / `data:` URLs — a classic stored-XSS vector
 * when CMS links are rendered into <a href>.
 */
const SAFE_HREF = /^(\/(?!\/)|#|https:\/\/|mailto:|tel:)/i

export const isSafeHref = (value: string): true | string => {
  const href = value.trim()
  if (/\s/.test(href) && !href.startsWith('mailto:')) return 'Link tidak boleh mengandung spasi.'
  return SAFE_HREF.test(href)
    ? true
    : 'Gunakan path internal (/contact), anchor (#id), https://, mailto:, atau tel:.'
}

type HrefOverrides = {
  name?: string
  label?: LocalizedText
  required?: boolean
  defaultValue?: string
  admin?: AdminOverrides
}

/** Fields that point at a page get the page picker; URLs of other kinds (video, website…) stay free text. */
const PICKER_FIELDS = new Set(['href', 'buttonHref'])

export const hrefField = ({ admin, ...overrides }: HrefOverrides = {}): TextField => {
  const name = overrides.name ?? 'href'
  return {
    name: 'href',
    label: 'Link',
    type: 'text',
    required: true,
    maxLength: 500,
    ...overrides,
    admin: {
      description: {
        en: 'Pick a page, or "Other" for your own URL (/contact, #faq, https://…).',
        id: 'Pilih halaman, atau "Lainnya" untuk URL sendiri (/contact, #faq, https://…).',
      },
      ...admin,
      ...(PICKER_FIELDS.has(name)
        ? { components: { Field: '/components/admin/LinkField#LinkField' } }
        : {}),
    },
    validate: withTextValidation(isSafeHref),
  }
}

export const linkFields = ({ withStyle = false }: { withStyle?: boolean } = {}): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'label', type: 'text', required: true, maxLength: 80, admin: { width: '50%' } },
      hrefField({ admin: { width: '50%' } }),
      ...(withStyle
        ? [
            {
              name: 'style',
              type: 'select',
              defaultValue: 'fill',
              options: [
                { label: 'Fill (utama)', value: 'fill' },
                { label: 'Outline', value: 'stroke' },
              ],
            } satisfies Field,
          ]
        : []),
    ],
  },
]

export const buttonsField = (maxRows = 4): Field => ({
  name: 'buttons',
  type: 'array',
  maxRows,
  labels: { singular: 'Button', plural: 'Buttons' },
  fields: linkFields({ withStyle: true }),
})
