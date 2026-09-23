import type { CollectionConfig } from 'payload'

/**
 * Adds an "Actions" column (Edit / Delete per row) to a collection's list
 * view. It's a UI-only field: nothing is stored and it never shows in forms.
 */
export function withRowActions(collection: CollectionConfig): CollectionConfig {
  const columns = collection.admin?.defaultColumns
  return {
    ...collection,
    admin: {
      ...collection.admin,
      ...(columns ? { defaultColumns: [...columns, 'rowActions'] } : {}),
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
