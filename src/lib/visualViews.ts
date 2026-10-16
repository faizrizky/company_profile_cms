import type { CollectionConfig } from 'payload'

import { env } from '@/lib/env'

type Views = NonNullable<NonNullable<CollectionConfig['admin']>['components']>['views']

/**
 * A document that opens on the drag & drop visual editor (served by the
 * website at /studio/<collection>/<id>) instead of its form: pages, solution
 * categories and products. The classic form stays one tab away ("Form") and
 * is what creates new documents.
 */
export const visualEditorViews = (): Views => ({
  edit: {
    default: {
      Component: {
        path: '/components/admin/VisualEditorView#VisualEditorView',
        clientProps: { frontendUrl: env.FRONTEND_URL },
      },
      tab: { label: 'Visual', order: 0 },
    },
    form: {
      Component: '@payloadcms/ui#DefaultEditView',
      path: '/form',
      tab: { label: 'Form', href: '/form', order: 100 },
    },
  },
})
