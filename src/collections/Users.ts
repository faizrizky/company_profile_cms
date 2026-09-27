import { APIError, type CollectionAfterChangeHook, type CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminField, isAdminOrOwnProfile, isAdminOrSelf } from '@/access'
import { twoFactorEndpoints } from '@/auth/twoFactor'
import { fieldCard } from '@/fields/card'
import { auditCollection, auditLogin } from '@/hooks/auditLog'
import { enforcePasswordPolicy } from '@/hooks/passwordPolicy'
import { env, isProduction } from '@/lib/env'
import { notifySecurity } from '@/lib/securityAlert'

const audit = auditCollection('users')

const never = () => false

/** Security alerts for account changes (see SECURITY_WEBHOOK_URL). */
const alertAccountChanges: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (req.context?.disableAudit) return doc
  const roles = (doc.roles ?? []).join(', ')
  if (operation === 'create') {
    await notifySecurity(req, `👤 User baru dibuat: ${doc.email} (${roles}) oleh ${req.user?.email ?? 'sistem'}`)
  } else if (JSON.stringify(doc.roles) !== JSON.stringify(previousDoc?.roles)) {
    await notifySecurity(req, `🛡️ Role diubah: ${doc.email} → ${roles} oleh ${req.user?.email ?? 'sistem'}`)
  }
  return doc
}

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
    read: isAdminOrOwnProfile,
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
    afterChange: [...audit.afterChange, alertAccountChanges],
    afterDelete: [
      ...audit.afterDelete,
      async ({ doc, req }) => notifySecurity(req, `🗑️ User dihapus: ${doc.email} oleh ${req.user?.email}`),
    ],
    afterLogin: [
      auditLogin,
      async ({ req, user }) => {
        await notifySecurity(req, `🔑 Login (password benar, menunggu kode 2FA): ${user.email}`)
      },
    ],
  },
  // Two-factor setup and login step: /api/users/2fa/…
  endpoints: twoFactorEndpoints,
  fields: [
    {
      // Live password requirements under Payload's password inputs.
      name: 'passwordChecklist',
      type: 'ui',
      admin: {
        disableListColumn: true,
        components: { Field: '/components/admin/PasswordChecklist#PasswordChecklist' },
      },
    },
    {
      // Two-factor (authenticator app): status, and a reset button for admins.
      name: 'totpEnabled',
      type: 'checkbox',
      defaultValue: false,
      // Only the 2FA endpoints change it (with overrideAccess).
      access: { create: never, update: never },
      admin: {
        position: 'sidebar',
        components: { Field: '/components/admin/TwoFactorStatus#TwoFactorStatus' },
      },
    },
    {
      // Encrypted secret, recovery code hashes, verified sessions. Never sent
      // over the API (read access false); the auth strategy still loads it.
      name: 'twoFactor',
      type: 'json',
      access: { read: never, create: never, update: never },
      admin: { hidden: true },
    },
    fieldCard({ en: 'Profile', id: 'Profil' }, [
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
                throw new APIError(
                  'Anda tidak bisa menghapus role admin dari akun sendiri.',
                  400,
                  undefined,
                  true,
                )
              }
              return value
            },
          ],
        },
      },
    ]),
  ],
}
