import type { Field, TextField } from 'payload'

import type { AdminOverrides } from './section'
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
  return SAFE_HREF.test(href) ? true : 'Gunakan path internal (/contact), anchor (#id), https://, mailto:, atau tel:.'
}

type HrefOverrides = {
  name?: string
  label?: string
  required?: boolean
  defaultValue?: string
  admin?: AdminOverrides
}

export const hrefField = ({ admin, ...overrides }: HrefOverrides = {}): TextField => ({
  name: 'href',
  type: 'text',
  required: true,
  maxLength: 500,
  ...overrides,
  admin: { description: 'Contoh: /contact, /solution/command-center, https://…', ...admin },
  validate: withTextValidation(isSafeHref),
})

export const linkFields = ({ withStyle = false }: { withStyle?: boolean } = {}): Field[] => [
  {
    type: 'row',
    fields: [
      { name: 'label', type: 'text', required: true, maxLength: 80 },
      hrefField(),
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

export const buttonsField = (maxRows = 2): Field => ({
  name: 'buttons',
  type: 'array',
  maxRows,
  labels: { singular: 'Button', plural: 'Buttons' },
  fields: linkFields({ withStyle: true }),
})
