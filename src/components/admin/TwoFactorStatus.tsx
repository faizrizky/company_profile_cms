'use client'

import { toast, useAuth, useConfig, useDocumentInfo, useField } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import type { User } from '@/payload-types'

import { TWO_FACTOR_SETUP_EVENT } from './TwoFactorGate'
import { useAdminText } from './useAdminText'

const TEXT = {
  en: {
    label: 'Two-step verification',
    on: 'Active (authenticator app)',
    off: 'Not set up — asked at next login',
    reset: 'Reset 2FA',
    confirm:
      'Reset this user’s two-step verification? They will set it up again at their next login.',
    done: '2FA has been reset.',
    failed: 'Could not reset 2FA.',
    newDevice: 'Move to a new phone',
  },
  id: {
    label: 'Verifikasi dua langkah',
    on: 'Aktif (aplikasi authenticator)',
    off: 'Belum diatur — diminta saat login berikutnya',
    reset: 'Reset 2FA',
    confirm:
      'Reset verifikasi dua langkah user ini? User akan mengaturnya ulang saat login berikutnya.',
    done: '2FA berhasil di-reset.',
    failed: 'Gagal me-reset 2FA.',
    newDevice: 'Pindah ke HP baru',
  },
}

/**
 * Sidebar of a user: whether 2FA is on. Admins can reset it for someone who
 * lost their phone; a user can move it to a new phone themselves.
 */
export function TwoFactorStatus() {
  const { value: enabled } = useField<boolean>({ path: 'totpEnabled' })
  const { id } = useDocumentInfo()
  const { user } = useAuth<User>()
  const { config } = useConfig()
  const router = useRouter()
  const t = useAdminText(TEXT)
  const [busy, setBusy] = useState(false)

  if (!id) return null
  const isSelf = String(user?.id) === String(id)
  const isAdmin = Boolean(user?.roles?.includes('admin'))

  const reset = async () => {
    if (!window.confirm(t.confirm)) return
    setBusy(true)
    const res = await fetch(`${config.serverURL}${config.routes.api}/users/2fa/reset/${id}`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null)
    setBusy(false)
    if (res?.ok) {
      toast.success(t.done)
      router.refresh()
    } else {
      toast.error(t.failed)
    }
  }

  return (
    <div className="falah-2fa-status field-type">
      <span className="falah-2fa-status__label">{t.label}</span>
      <span className={`falah-2fa-status__pill${enabled ? ' is-on' : ''}`}>
        {enabled ? t.on : t.off}
      </span>
      {isSelf && enabled && (
        <button
          type="button"
          className="falah-2fa-status__button"
          onClick={() => window.dispatchEvent(new Event(TWO_FACTOR_SETUP_EVENT))}
        >
          {t.newDevice}
        </button>
      )}
      {!isSelf && isAdmin && enabled && (
        <button
          type="button"
          className="falah-2fa-status__button is-danger"
          onClick={reset}
          disabled={busy}
        >
          {t.reset}
        </button>
      )}
    </div>
  )
}
