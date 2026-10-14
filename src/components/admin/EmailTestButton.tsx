'use client'

import { toast, useConfig, useDocumentInfo, useFormModified } from '@payloadcms/ui'
import { useCallback, useEffect, useState } from 'react'

import { useAdminText } from './useAdminText'

const TEXT = {
  en: {
    label: 'Test',
    help: 'Sends a sample message to the contact address, with the published sender and subject.',
    button: 'Send a test email',
    sending: 'Sending… (the mail server can take up to 2 minutes)',
    saveFirst:
      'Publish your changes first: the test (and every email) uses the published settings.',
    sent: (to: string) => `Test email sent to ${to}.`,
    failed: 'The test email could not be sent.',
  },
  id: {
    label: 'Uji coba',
    help: 'Mengirim pesan contoh ke alamat email kontak, dengan pengirim dan subjek yang sudah dipublish.',
    button: 'Kirim email uji',
    sending: 'Mengirim… (server email bisa butuh sampai 2 menit)',
    saveFirst:
      'Publikasikan perubahan dulu: uji coba (dan setiap email) memakai pengaturan yang sudah dipublish.',
    sent: (to: string) => `Email uji terkirim ke ${to}.`,
    failed: 'Email uji gagal dikirim.',
  },
}

type Status = {
  running: boolean
  startedAt: number | null
  last: { ok: boolean; to?: string; error?: string; at: number } | null
}

const POLL_MS = 3000

/**
 * Email tab of the site settings: sends a sample email to check the server
 * and the sender. The test runs on the server (see endpoints/testEmail): the
 * button follows it there, so it stays locked — and still reports the result —
 * after the page is reloaded.
 */
export function EmailTestButton() {
  const { config } = useConfig()
  const t = useAdminText(TEXT)
  const modified = useFormModified()
  const { hasSavePermission } = useDocumentInfo()
  const url = `${config.serverURL}${config.routes.api}/globals/site-settings/test-email`
  // The test being followed (its start time), or null.
  const [watching, setWatching] = useState<number | null>(null)
  const [starting, setStarting] = useState(false)

  const status = useCallback(async (): Promise<Status | null> => {
    const res = await fetch(url, { credentials: 'include' }).catch(() => null)
    return res?.ok ? ((await res.json()) as Status) : null
  }, [url])

  // A test already running (started before a reload, or by another admin).
  useEffect(() => {
    let cancelled = false
    void status().then((s) => {
      if (!cancelled && s?.running && s.startedAt) setWatching(s.startedAt)
    })
    return () => {
      cancelled = true
    }
  }, [status])

  // Follow it until it reports back.
  useEffect(() => {
    if (watching === null) return
    const timer = window.setInterval(async () => {
      const s = await status()
      if (!s || s.running) return
      setWatching(null)
      if (s.last && s.last.at >= watching) {
        if (s.last.ok) toast.success(t.sent(s.last.to ?? ''))
        else toast.error(s.last.error || t.failed)
      }
    }, POLL_MS)
    return () => window.clearInterval(timer)
  }, [status, t, watching])

  if (hasSavePermission === false) return null

  const start = async () => {
    setStarting(true)
    try {
      const res = await fetch(url, { method: 'POST', credentials: 'include' })
      const data = (await res.json().catch(() => ({}))) as { startedAt?: number; error?: string }
      // 202: started; 409: one is already running — either way, follow it.
      if ((res.status === 202 || res.status === 409) && data.startedAt) setWatching(data.startedAt)
      else toast.error(data.error || t.failed)
    } catch {
      toast.error(t.failed)
    } finally {
      setStarting(false)
    }
  }

  const busy = starting || watching !== null

  return (
    <div className="falah-tutorial-replay field-type">
      <span className="falah-tutorial-replay__label">{t.label}</span>
      <p className="falah-tutorial-replay__help">{modified ? t.saveFirst : t.help}</p>
      <button
        type="button"
        className="falah-tutorial-replay__button"
        onClick={start}
        disabled={busy || modified}
      >
        {busy ? t.sending : t.button}
      </button>
    </div>
  )
}
