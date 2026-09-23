'use client'

import { DefaultEditView, useDocumentInfo, useLocale, useTranslation } from '@payloadcms/ui'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof DefaultEditView> & { frontendUrl: string }

/**
 * Default view for Pages: the drag & drop visual editor (served by the
 * website at /studio) embedded full-height inside the admin. The classic
 * form stays available in the "Form" tab, and is used to create new pages.
 */
export function VisualEditorView({ frontendUrl, ...props }: Props) {
  const { id } = useDocumentInfo()
  const locale = useLocale()
  const { i18n } = useTranslation()

  if (!id) return <DefaultEditView {...props} />

  const src = `${frontendUrl}/studio/pages/${id}?locale=${locale.code}&ui=${i18n.language === 'id' ? 'id' : 'en'}&embed=1`
  return (
    <div className="falah-visual">
      <iframe
        key={src}
        className="falah-visual__frame"
        src={src}
        title={i18n.language === 'id' ? 'Editor visual' : 'Visual editor'}
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
}
