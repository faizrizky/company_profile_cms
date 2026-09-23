'use client'

import { ConfirmationModal, Link, toast, useAuth, useConfig, useModal, useTranslation } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import type { DefaultCellComponentProps } from 'payload'

/**
 * "Actions" column for list views: Edit and Delete on every row.
 * Delete only shows when the signed-in user may delete in this collection
 * (the CMS enforces the same rule server-side).
 */
export function RowActions({ rowData, collectionSlug }: DefaultCellComponentProps) {
  const { config } = useConfig()
  const { permissions } = useAuth()
  const { openModal } = useModal()
  const { i18n } = useTranslation()
  const router = useRouter()

  const id = rowData?.id
  if (id === undefined || id === null) return null

  const isId = i18n.language === 'id'
  const { admin, api } = config.routes
  const label = rowData.title ?? rowData.name ?? rowData.filename ?? rowData.email
  const title = label ? String(label) : isId ? 'Tanpa judul' : 'Untitled'
  const canDelete = Boolean(permissions?.collections?.[collectionSlug]?.delete)
  const modalSlug = `delete-${collectionSlug}-${id}`

  const onDelete = async () => {
    const res = await fetch(`${config.serverURL}${api}/${collectionSlug}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      toast.success(isId ? `"${title}" dihapus.` : `"${title}" deleted.`)
      router.refresh()
    } else {
      toast.error(isId ? 'Gagal menghapus. Periksa izin Anda.' : 'Could not delete. Check your permissions.')
    }
  }

  return (
    <div className="falah-row-actions">
      <Link className="falah-row-actions__btn" href={`${admin}/collections/${collectionSlug}/${id}`}>
        {isId ? 'Edit' : 'Edit'}
      </Link>
      {canDelete && (
        <>
          <button
            type="button"
            className="falah-row-actions__btn falah-row-actions__btn--danger"
            onClick={() => openModal(modalSlug)}
          >
            {isId ? 'Hapus' : 'Delete'}
          </button>
          <ConfirmationModal
            className="falah-confirm--danger"
            modalSlug={modalSlug}
            heading={isId ? 'Hapus item ini?' : 'Delete this item?'}
            body={
              isId
                ? `"${title}" akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`
                : `"${title}" will be permanently deleted. This can't be undone.`
            }
            confirmLabel={isId ? 'Hapus' : 'Delete'}
            confirmingLabel={isId ? 'Menghapus…' : 'Deleting…'}
            cancelLabel={isId ? 'Batal' : 'Cancel'}
            onConfirm={onDelete}
          />
        </>
      )}
    </div>
  )
}
