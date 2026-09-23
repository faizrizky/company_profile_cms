import type { FieldHook, TextField } from 'payload'

import { withTextValidation } from './validate'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugify = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const formatSlug =
  (fallbackField: string): FieldHook =>
  ({ value, data, operation }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const fallback = data?.[fallbackField]
    if (operation === 'create' && typeof fallback === 'string') return slugify(fallback)
    return value
  }

type SlugOverrides = { reserved?: ReadonlySet<string> }

export const slugField = (fallbackField = 'title', { reserved }: SlugOverrides = {}): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  maxLength: 80,
  admin: {
    position: 'sidebar',
    description: 'Bagian URL. Huruf kecil, angka, dan tanda "-". Otomatis dari judul bila kosong.',
  },
  hooks: { beforeValidate: [formatSlug(fallbackField)] },
  validate: withTextValidation((value) => {
    if (!SLUG_PATTERN.test(value)) return 'Slug hanya boleh a-z, 0-9, dan "-".'
    if (reserved?.has(value)) return `Slug "${value}" dipakai sistem.`
    return true
  }),
})
