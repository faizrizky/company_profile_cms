import type { Condition, Field, GroupField, UploadField } from 'payload'

/** The subset of admin options our field helpers expose. */
export type AdminOverrides = { description?: string; condition?: Condition; width?: string }

export const imageField = (
  name: string,
  overrides: { required?: boolean; label?: string; admin?: AdminOverrides } = {},
): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  ...overrides,
})

/** Eyebrow pill + heading + intro paragraph used by almost every section. */
export const sectionHeaderField = ({ eyebrow = true } = {}): GroupField => ({
  name: 'header',
  type: 'group',
  fields: [
    ...(eyebrow
      ? [{ name: 'eyebrow', type: 'text', maxLength: 120 } satisfies Field]
      : []),
    {
      name: 'title',
      type: 'textarea',
      required: true,
      maxLength: 200,
      admin: { rows: 2, description: 'Enter untuk pindah baris.' },
    },
    { name: 'description', type: 'textarea', maxLength: 500, admin: { rows: 3 } },
  ],
})

export const backgroundFields = ({ mobile = false, required = false } = {}): Field[] => [
  {
    type: 'row',
    fields: [
      imageField('background', { required, admin: { width: '50%' } }),
      ...(mobile
        ? [
            imageField('backgroundMobile', {
              label: 'Background (mobile)',
              admin: { width: '50%', description: 'Opsional. Dipakai di layar < 768px.' },
            }),
          ]
        : []),
    ],
  },
]

export const iconCardFields: Field[] = [
  imageField('icon', { required: true }),
  { name: 'title', type: 'text', required: true, maxLength: 120 },
  { name: 'description', type: 'textarea', maxLength: 400 },
]
