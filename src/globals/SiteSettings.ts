import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { hrefField } from '@/fields/link'
import { imageField } from '@/fields/section'
import { withTextValidation } from '@/fields/validate'
import { auditGlobal } from '@/hooks/auditLog'
import { revalidateGlobal } from '@/hooks/revalidateFrontend'

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
                  admin: { description: 'Alamat lengkap (dipakai untuk pin Google Maps).' },
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
                      maxLength: 20,
                      validate: withTextValidation((v) =>
                        /^[1-9][0-9]{7,14}$/.test(v) ? true : 'Format internasional tanpa + / spasi, mis. 6281234567890',
                      ),
                      admin: { description: 'Mis. 6281234567890' },
                    },
                    { name: 'whatsappMessage', type: 'text', maxLength: 200, label: 'Pesan awal WhatsApp' },
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
                        { label: 'Lainnya (ikon sendiri)', value: 'other' },
                      ],
                      admin: { width: '25%', description: 'Ikonnya otomatis sesuai platform.' },
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
