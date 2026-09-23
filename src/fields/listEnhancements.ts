import type { CollectionConfig } from 'payload'

/**
 * List-view improvements for a collection:
 * - an "Actions" column (Edit / Delete per row) — a UI-only field, nothing is
 *   stored and it never shows in forms;
 * - the bulk-selection bar placed directly above the table.
 */
export function withListEnhancements(collection: CollectionConfig): CollectionConfig {
  const columns = collection.admin?.defaultColumns
  return {
    ...collection,
    admin: {
      ...collection.admin,
      ...(columns ? { defaultColumns: [...columns, 'rowActions'] } : {}),
      components: {
        ...collection.admin?.components,
        beforeListTable: [
          ...(collection.admin?.components?.beforeListTable ?? []),
          {
            path: '/components/admin/SelectionBar#SelectionBar',
            clientProps: { collectionSlug: collection.slug },
          },
        ],
      },
    },
    fields: [
      ...collection.fields,
      {
        name: 'rowActions',
        type: 'ui',
        label: { en: 'Actions', id: 'Aksi' },
        admin: {
          disableBulkEdit: true,
          components: {
            Cell: '/components/admin/RowActions#RowActions',
            Field: '/components/admin/Nothing#Nothing',
          },
        },
      },
    ],
  }
}
