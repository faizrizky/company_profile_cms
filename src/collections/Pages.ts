import type { CollectionConfig } from 'payload'

import { publishedOrAuthenticated } from '@/access'
import { pageBlocks } from '@/blocks'
import { contentAccess, contentHooks } from '@/collections/content'
import { fieldCard } from '@/fields/card'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { visualEditorViews } from '@/lib/visualViews'

/** Routes owned by the frontend that a CMS page must never shadow. */
const RESERVED_SLUGS = new Set(['api', 'admin', '_next', 'solution-category'])

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
    components: {
      // Opening a page lands in the visual editor; the classic form is one tab away.
      views: visualEditorViews(),
    },
  },
  access: contentAccess(publishedOrAuthenticated),
  versions: {
    drafts: { autosave: { interval: 2000, showSaveDraftButton: true }, schedulePublish: true },
    maxPerDoc: 50,
  },
  hooks: contentHooks('pages'),
  fields: [
    fieldCard({ en: 'General', id: 'Umum' }, [
      { name: 'title', type: 'text', required: true, maxLength: 120 },
    ]),
    slugField('title', { reserved: RESERVED_SLUGS }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: pageBlocks,
              required: true,
              minRows: 1,
              admin: { initCollapsed: true },
            },
          ],
        },
        { label: 'SEO', fields: [seoField] },
      ],
    },
  ],
}
