import type { GlobalConfig } from 'payload'

import { anyone, isAuthenticated } from '@/access'
import { linkFields } from '@/fields/link'
import { auditGlobal } from '@/hooks/auditLog'
import { revalidateGlobal } from '@/hooks/revalidateFrontend'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings', description: 'Alamat, email, telepon & sosial media diatur di Site Settings.' },
  access: { read: anyone, update: isAuthenticated },
  hooks: { afterChange: [auditGlobal('footer'), revalidateGlobal('footer')] },
  fields: [
    { name: 'description', type: 'textarea', maxLength: 300 },
    {
      name: 'columns',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', required: true, maxLength: 40 },
        { name: 'links', type: 'array', maxRows: 10, fields: linkFields() },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      maxLength: 160,
      admin: { description: 'Gunakan {year} untuk tahun berjalan.' },
    },
  ],
}
