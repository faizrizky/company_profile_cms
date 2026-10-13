'use client'

import { useConfig } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import { useAdminText } from './useAdminText'

const TEXT = {
  en: {
    label: 'Sent to',
    help: 'The address in the Contact tab of these settings. Change it there.',
    none: 'No contact address set yet.',
  },
  id: {
    label: 'Dikirim ke',
    help: 'Alamat email di tab Contact pengaturan ini. Ubah di sana.',
    none: 'Alamat email kontak belum diisi.',
  },
}

/** Who gets the email: the contact address of the site settings (shown, edited there). */
export function EmailRecipientNote() {
  const { config } = useConfig()
  const t = useAdminText(TEXT)
  const [email, setEmail] = useState<string | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    fetch(`${config.serverURL}${config.routes.api}/globals/site-settings?depth=0`, {
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { contact?: { email?: string } } | null) => {
        if (!cancelled) setEmail(data?.contact?.email?.trim() || null)
      })
      .catch(() => {
        if (!cancelled) setEmail(null)
      })
    return () => {
      cancelled = true
    }
  }, [config.routes.api, config.serverURL])

  return (
    <div className="falah-tutorial-replay field-type">
      <span className="falah-tutorial-replay__label">{t.label}</span>
      <strong>{email === undefined ? '…' : (email ?? t.none)}</strong>
      <p className="falah-tutorial-replay__help">{t.help}</p>
    </div>
  )
}
