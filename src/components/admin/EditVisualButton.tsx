'use client'

import { useDocumentInfo, useLocale, useTranslation } from '@payloadcms/ui'

type Props = { frontendUrl: string }

/** Sidebar button on Pages: opens the document in the visual editor (frontend /studio). */
export function EditVisualButton({ frontendUrl }: Props) {
  const { id } = useDocumentInfo()
  const locale = useLocale()
  const { i18n } = useTranslation()
  const isId = i18n.language === 'id'

  if (!id) {
    return (
      <p className="falah-edit-visual__hint">
        {isId ? 'Simpan halaman dulu untuk membuka editor visual.' : 'Save the page first to open the visual editor.'}
      </p>
    )
  }

  const href = `${frontendUrl}/studio/pages/${id}?locale=${locale.code}&ui=${i18n.language}`
  return (
    <a className="falah-edit-visual" href={href}>
      <span aria-hidden>✦</span>
      {isId ? 'Edit Visual (drag & drop)' : 'Visual editor (drag & drop)'}
    </a>
  )
}
