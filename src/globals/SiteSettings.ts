import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { hrefField } from '@/fields/link'
import { imageField } from '@/fields/section'
import { withTextValidation } from '@/fields/validate'
import { auditGlobal } from '@/hooks/auditLog'
import { revalidateGlobal } from '@/hooks/revalidateFrontend'

/** Digits only, Indonesian local numbers (0…) converted to the 62 country code. */
const normalizeWhatsapp = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return value
  const digits = value.replace(/\D/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [auditGlobal('site-settings'), revalidateGlobal('site-settings')] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true, maxLength: 80 },
            { name: 'siteDescription', type: 'textarea', required: true, maxLength: 160 },
            imageField('logo', { required: true }),
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'address',
                  type: 'textarea',
                  required: true,
                  maxLength: 300,
                  admin: {
                    description: { en: 'Full address (shown on the website map).', id: 'Alamat lengkap (ditampilkan di peta website).' },
                  },
                },
                {
                  name: 'mapPicker',
                  type: 'ui',
                  admin: { components: { Field: '/components/admin/MapPicker#MapPicker' } },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'latitude',
                      type: 'number',
                      min: -90,
                      max: 90,
                      admin: { width: '50%', step: 0.000001, description: { en: 'Filled in from the map.', id: 'Terisi otomatis dari peta.' } },
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      min: -180,
                      max: 180,
                      admin: { width: '50%', step: 0.000001, description: { en: 'Filled in from the map.', id: 'Terisi otomatis dari peta.' } },
                    },
                  ],
                },
                {
                  name: 'shortAddress',
                  type: 'textarea',
                  maxLength: 160,
                  admin: { rows: 2, description: 'Versi singkat untuk footer. Enter = baris baru.' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'email', type: 'email', required: true },
                    {
                      name: 'phone',
                      type: 'text',
                      required: true,
                      maxLength: 30,
                      admin: { description: 'Format tampilan, mis. 021 2696 1651' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'whatsappNumber',
                      type: 'text',
                      label: { en: 'WhatsApp number', id: 'Nomor WhatsApp' },
                      maxLength: 25,
                      hooks: {
                        // Accept 0812…, +62 812-…, 62812…; store as 62812… (what wa.me needs).
                        beforeValidate: [({ value }) => normalizeWhatsapp(value)],
                      },
                      validate: withTextValidation((v, lang) =>
                        /^[1-9][0-9]{7,14}$/.test(v)
                          ? true
                          : lang === 'id'
                            ? 'Nomor tidak valid. Contoh: 0812 3456 7890 atau +62 812 3456 7890'
                            : 'Invalid number. Example: 0812 3456 7890 or +62 812 3456 7890',
                      ),
                      admin: {
                        description: {
                          en: 'Number visitors reach when they click WhatsApp. You can type 0812…, +62 812… or 62812…',
                          id: 'Nomor yang dihubungi saat pengunjung klik WhatsApp. Boleh ditulis 0812…, +62 812… atau 62812…',
                        },
                      },
                    },
                    {
                      name: 'whatsappMessage',
                      type: 'text',
                      maxLength: 200,
                      label: { en: 'WhatsApp opening message', id: 'Pesan awal WhatsApp' },
                      admin: {
                        description: {
                          en: 'Optional. Text already typed in when the chat opens.',
                          id: 'Opsional. Teks yang sudah terisi saat chat terbuka.',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socials',
              type: 'array',
              maxRows: 10,
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      defaultValue: 'other',
                      options: [
                        { label: 'Facebook', value: 'facebook' },
                        { label: 'Instagram', value: 'instagram' },
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'TikTok', value: 'tiktok' },
                        { label: 'YouTube', value: 'youtube' },
                        { label: 'X (Twitter)', value: 'x' },
                        { label: 'WhatsApp', value: 'whatsapp' },
                        { label: { en: 'Other (own icon)', id: 'Lainnya (ikon sendiri)' }, value: 'other' },
                      ],
                      admin: { width: '25%', description: { en: 'The icon follows the platform.', id: 'Ikonnya otomatis sesuai platform.' } },
                    },
                    { name: 'label', type: 'text', required: true, maxLength: 40 },
                    hrefField({ name: 'url' }),
                  ],
                },
                imageField('icon', {
                  admin: { condition: (_, row) => row?.platform === 'other' },
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
}
