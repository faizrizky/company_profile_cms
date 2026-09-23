import { APIError, type CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminField, isAdminOrSelf } from '@/access'
import { auditCollection, auditLogin } from '@/hooks/auditLog'
import { enforcePasswordPolicy } from '@/hooks/passwordPolicy'
import { env, isProduction } from '@/lib/env'

const audit = auditCollection('users')

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roles', 'updatedAt'],
    group: 'System',
  },
  auth: {
    tokenExpiration: 60 * 60 * 2, // 2 hours
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
    cookies: {
      secure: isProduction,
      sameSite: 'Strict',
      domain: env.COOKIE_DOMAIN,
    },
  },
  access: {
    // There is no public sign-up: only admins create accounts.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
    admin: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [enforcePasswordPolicy],
    beforeDelete: [
      ({ id, req }) => {
        if (req.user && String(req.user.id) === String(id)) {
          throw new APIError('Anda tidak bisa menghapus akun sendiri.', 400, undefined, true)
        }
      },
    ],
    afterChange: audit.afterChange,
    afterDelete: audit.afterDelete,
    afterLogin: [auditLogin],
  },
  fields: [
    { name: 'name', type: 'text', maxLength: 120 },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        // Editors can't promote themselves.
        create: isAdminField,
        update: isAdminField,
      },
      admin: { description: 'Admin: kelola user & pengaturan. Editor: kelola konten saja.' },
      hooks: {
        beforeChange: [
          ({ value, originalDoc, req }) => {
            const demotingSelf =
              req.user &&
              originalDoc &&
              String(req.user.id) === String(originalDoc.id) &&
              hasRole(req.user, 'admin') &&
              !(value as string[] | undefined)?.includes('admin')
            if (demotingSelf) {
              throw new APIError('Anda tidak bisa menghapus role admin dari akun sendiri.', 400, undefined, true)
            }
            return value
          },
        ],
      },
    },
  ],
}
