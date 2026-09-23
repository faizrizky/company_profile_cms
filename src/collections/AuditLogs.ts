import type { CollectionConfig } from 'payload'

import { isAdmin, nobody } from '@/access'

/** Append-only: nobody (not even admins) can edit or delete entries through the API. */
export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'resource',
    defaultColumns: ['createdAt', 'action', 'resource', 'documentId', 'user', 'ip'],
    group: 'System',
    description: 'Riwayat perubahan & login. Tidak bisa diubah atau dihapus.',
  },
  access: {
    read: isAdmin,
    create: nobody,
    update: nobody,
    delete: nobody,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'action',
      type: 'select',
      required: true,
      index: true,
      options: ['create', 'update', 'delete', 'login'].map((v) => ({ label: v, value: v })),
    },
    { name: 'resource', type: 'text', required: true, index: true },
    { name: 'documentId', type: 'text' },
    { name: 'changedFields', type: 'text', hasMany: true },
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'ip', type: 'text' },
    { name: 'userAgent', type: 'text' },
  ],
}
