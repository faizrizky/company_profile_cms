import type { GlobalConfig } from 'payload'

import { isAuthenticated, publishedOrAuthenticated } from '@/access'
import { linkFields } from '@/fields/link'
import { auditGlobal } from '@/hooks/auditLog'
import { revalidateGlobal } from '@/hooks/revalidateFrontend'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Settings',
    description: 'Alamat, email, telepon & sosial media diatur di Site Settings.',
  },
  // The website reads the published version; drafts (and `?draft=true`)
  // stay behind sign-in.
  access: { read: publishedOrAuthenticated, readVersions: isAuthenticated, update: isAuthenticated },
  // Like pages: changes are drafts (saved automatically) until published.
  versions: {
    drafts: { autosave: { interval: 2000, showSaveDraftButton: true }, schedulePublish: true },
    max: 50,
  },
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
