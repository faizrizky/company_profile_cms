import type { GlobalConfig } from 'payload'

import { isAdmin, isAuthenticated } from '@/access'
import { fieldCard } from '@/fields/card'
import { auditGlobal } from '@/hooks/auditLog'
import { normalizeSteps, stepsProblem } from '@/tutorial/normalize'

/**
 * The guided tour (see src/tutorial). Every signed-in user reads it — that's
 * how the tour knows its steps — and can open this page to look through them
 * and run the tour; only admins change, add or remove steps.
 */
export const Tutorial: GlobalConfig = {
  slug: 'tutorial',
  label: { en: 'Tutorial', id: 'Tutorial' },
  admin: {
    group: 'Settings',
    description: {
      en: 'The guided tour shown to new users, and replayed from the Account page.',
      id: 'Tutorial yang tampil untuk pengguna baru, dan bisa diulang dari halaman Akun.',
    },
  },
  access: { read: isAuthenticated, update: isAdmin },
  hooks: { afterChange: [auditGlobal('tutorial')] },
  fields: [
    {
      // Raised by "Show again to everyone": users who saw a lower version see it again.
      name: 'version',
      type: 'number',
      defaultValue: 1,
      min: 1,
      label: { en: 'Version', id: 'Versi' },
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: { en: 'Show automatically', id: 'Tampilkan otomatis' },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Opens on its own for everyone who hasn’t seen this version of the tour yet.',
          id: 'Terbuka sendiri untuk setiap pengguna yang belum melihat versi tutorial ini.',
        },
      },
    },
    {
      // Under the version: run it, show it again to everyone, restore the defaults.
      name: 'tutorialActions',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/tutorial/TutorialSettingsActions#TutorialSettingsActions',
        },
      },
    },
    fieldCard({ en: 'Steps', id: 'Langkah' }, [
      {
        // One JSON value edited by a light editor (only the open step renders
        // its inputs): as a Payload array, 28 steps × 12 fields took seconds to open.
        name: 'steps',
        type: 'json',
        label: { en: 'Steps', id: 'Langkah' },
        // No defaultValue (it would be baked into the column): until first saved,
        // the editor and the tour use DEFAULT_TUTORIAL_STEPS from the code.
        validate: (value: unknown, { req }: { req: { i18n?: { language?: string } } }) =>
          stepsProblem(value, req.i18n?.language === 'id' ? 'id' : 'en') ?? true,
        hooks: { beforeChange: [({ value }) => normalizeSteps(value)] },
        admin: {
          components: {
            Field: '/components/admin/tutorial/TutorialStepsEditor#TutorialStepsEditor',
          },
        },
      },
    ]),
  ],
}
