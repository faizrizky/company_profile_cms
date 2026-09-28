'use client'

import { getTranslation } from '@payloadcms/translations'
import { ListSelection, useConfig, useTranslation } from '@payloadcms/ui'

/**
 * Bulk-selection bar rendered right above the list table (instead of the
 * page header): "N selected — Select all — Delete / Publish / Unpublish".
 * Edit stays per row (see RowActions).
 */
export function SelectionBar({ collectionSlug }: { collectionSlug: string }) {
  const { getEntityConfig } = useConfig()
  const { i18n } = useTranslation()
  const collectionConfig = getEntityConfig({ collectionSlug })
  if (!collectionConfig) return null

  return (
    <div className="falah-selection">
      <ListSelection
        collectionConfig={collectionConfig}
        label={getTranslation(collectionConfig.labels.plural, i18n)}
        disableBulkEdit
        modalPrefix="falah-"
      />
    </div>
  )
}
