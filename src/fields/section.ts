import type { Condition, Field, GroupField, UploadField } from 'payload'

/** The subset of admin options our field helpers expose. */
/** Plain text, or one text per admin language ({ en, id }). */
export type LocalizedText = string | Record<string, string>

export type AdminOverrides = { description?: LocalizedText; condition?: Condition; width?: string }

/** An image from the media library (videos and PDFs can't be picked). */
export const imageField = (
  name: string,
  overrides: { required?: boolean; label?: LocalizedText; admin?: AdminOverrides } = {},
): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  filterOptions: { mimeType: { contains: 'image/' } },
  ...overrides,
  admin: {
    ...overrides.admin,
    components: {
      afterInput: [
        {
          path: '/components/admin/UploadFieldActions#UploadFieldActions',
          clientProps: { kind: 'image' },
        },
      ],
    },
  },
})

/**
 * A video (MP4 / WebM) from the media library. Keep clips short and web-sized:
 * H.264 MP4, 720–1080p, "faststart", no audio for looping backgrounds.
 */
export const videoField = (
  name: string,
  overrides: { required?: boolean; label?: LocalizedText; admin?: AdminOverrides } = {},
): UploadField => ({
  name,
  type: 'upload',
  relationTo: 'media',
  filterOptions: { mimeType: { contains: 'video/' } },
  ...overrides,
  admin: {
    ...overrides.admin,
    components: {
      afterInput: [
        {
          path: '/components/admin/UploadFieldActions#UploadFieldActions',
          clientProps: { kind: 'video' },
        },
      ],
    },
  },
})

/** Eyebrow pill + heading + intro paragraph used by almost every section. */
export const sectionHeaderField = ({ eyebrow = true } = {}): GroupField => ({
  name: 'header',
  type: 'group',
  fields: [
    ...(eyebrow ? [{ name: 'eyebrow', type: 'text', maxLength: 120 } satisfies Field] : []),
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
