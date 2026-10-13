'use client'

import { toast, useConfig, useDocumentInfo, useFormModified } from '@payloadcms/ui'
import { useState } from 'react'

import { useAdminText } from './useAdminText'

const TEXT = {
  en: {
    label: 'Test',
    help: 'Sends a sample message to the contact address, with the saved sender and subject.',
    button: 'Send a test email',
    sending: 'Sending… (the mail server can take up to 2 minutes)',
    saveFirst: 'Save your changes first: the test uses what is saved.',
    sent: (to: string) => `Test email sent to ${to}.`,
    failed: 'The test email could not be sent.',
  },
  id: {
    label: 'Uji coba',
    help: 'Mengirim pesan contoh ke alamat email kontak, dengan pengirim dan subjek yang tersimpan.',
    button: 'Kirim email uji',
    sending: 'Mengirim… (server email bisa butuh sampai 2 menit)',
    saveFirst: 'Simpan perubahan dulu: uji coba memakai yang sudah tersimpan.',
    sent: (to: string) => `Email uji terkirim ke ${to}.`,
    failed: 'Email uji gagal dikirim.',
  },
}

/** Email tab of the site settings: sends a sample email to check the server and the sender. */
export function EmailTestButton() {
  const { config } = useConfig()
  const t = useAdminText(TEXT)
  const modified = useFormModified()
  const { hasSavePermission } = useDocumentInfo()
  const [busy, setBusy] = useState(false)
  if (hasSavePermission === false) return null

  const send = async () => {
    setBusy(true)
    try {
      const res = await fetch(
        `${config.serverURL}${config.routes.api}/globals/site-settings/test-email`,
        {
          method: 'POST',
          credentials: 'include',
        },
      )
      const data = (await res.json().catch(() => ({}))) as { to?: string; error?: string }
      if (res.ok) toast.success(t.sent(data.to ?? ''))
      else toast.error(data.error || t.failed)
    } catch {
      toast.error(t.failed)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="falah-tutorial-replay field-type">
      <span className="falah-tutorial-replay__label">{t.label}</span>
      <p className="falah-tutorial-replay__help">{modified ? t.saveFirst : t.help}</p>
      <button
        type="button"
        className="falah-tutorial-replay__button"
        onClick={send}
        disabled={busy || modified}
      >
        {busy ? t.sending : t.button}
      </button>
    </div>
  )
}
