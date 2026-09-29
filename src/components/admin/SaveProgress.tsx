'use client'

import { toast as payloadToast, useTranslation } from '@payloadcms/ui'
import { type ReactNode, useEffect, useState } from 'react'

type Toast =
  | { kind: 'saving'; label: string; pct: number }
  | { kind: 'success' | 'error'; message: string }

/** While our card is up, Payload's own save toast is hidden (see _motion.scss). */
const QUIET_CLASS = 'falah-save-quiet'

/** A document save from the edit form: POST/PATCH to /api/<collection>[/<id>] or /api/globals/<slug>. */
function saveKind(input: RequestInfo | URL, init?: RequestInit): 'publish' | 'save' | null {
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
  if (method !== 'POST' && method !== 'PATCH') return null
  const url = new URL(input instanceof Request ? input.url : String(input), window.location.href)
  if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')) return null
  // Autosave runs quietly in the background; login, preferences etc. are not saves.
  if (url.searchParams.get('autosave') === 'true') return null
  if (/^\/api\/(users|payload-preferences|payload-locked-documents)\b/.test(url.pathname)) return null
  if (!/^\/api\/(globals\/[^/]+|[^/]+(\/\d+)?)$/.test(url.pathname)) return null
  const body = init?.body
  if (!(body instanceof FormData)) return null
  const raw = body.get('_payload')
  if (typeof raw !== 'string') return null
  try {
    return (JSON.parse(raw) as { _status?: string })._status === 'published' ? 'publish' : 'save'
  } catch {
    return 'save'
  }
}

/**
 * Saving or publishing from the edit form shows one card, in the visual
 * editor's toast design: progress with a percentage, then the result. The
 * save is one request, so the percentage eases towards 90% while it runs and
 * reaches 100% when the CMS answers.
 */
export function SaveProgressProvider({ children }: { children?: ReactNode }) {
  const { i18n } = useTranslation()
  const id = i18n.language === 'id'
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    // Payload can mount providers more than once (and dev mounts effects
    // twice): wrap fetch only once, or each wrapper would show its own card.
    const current = window.fetch as typeof window.fetch & { __falahSaveProgress?: true }
    if (current.__falahSaveProgress) return
    const original = window.fetch
    let run = 0
    let hideTimer: number | undefined

    const wrapped = async (input: RequestInfo | URL, init?: RequestInit) => {
      const kind = saveKind(input, init)
      if (!kind) return original(input, init)

      const label =
        kind === 'publish' ? (id ? 'Memublikasikan…' : 'Publishing…') : id ? 'Menyimpan…' : 'Saving…'
      const mine = ++run
      window.clearTimeout(hideTimer)
      document.body.classList.add(QUIET_CLASS)
      let pct = 8
      setToast({ kind: 'saving', label, pct })
      const timer = window.setInterval(() => {
        pct += (90 - pct) * 0.12
        if (mine === run) setToast({ kind: 'saving', label, pct })
      }, 180)

      const finish = (next: Toast) => {
        window.clearInterval(timer)
        if (mine !== run) return
        setToast(next)
        hideTimer = window.setTimeout(() => {
          setToast(null)
          // Payload's own "Updated successfully" toast is still queued behind
          // ours: close it too, or it would pop up once ours is gone.
          payloadToast.dismiss()
          // Let its exit animation finish while it's still hidden.
          hideTimer = window.setTimeout(() => document.body.classList.remove(QUIET_CLASS), 600)
        }, next.kind === 'error' ? 6000 : 4000)
      }

      try {
        const res = await original(input, init)
        const body = (await res
          .clone()
          .json()
          .catch(() => ({}))) as { message?: string; errors?: { message?: string }[] }
        if (res.ok) {
          finish({
            kind: 'success',
            message: body.message || (id ? 'Berhasil disimpan.' : 'Updated successfully.'),
          })
        } else {
          finish({ kind: 'error', message: body.errors?.[0]?.message || body.message || `HTTP ${res.status}` })
        }
        return res
      } catch (error) {
        finish({ kind: 'error', message: (error as Error).message || 'Error' })
        throw error
      }
    }
    window.fetch = Object.assign(wrapped, { __falahSaveProgress: true as const })
    return () => {
      if (window.fetch === wrapped) window.fetch = original
      window.clearTimeout(hideTimer)
      document.body.classList.remove(QUIET_CLASS)
    }
  }, [id])

  return (
    <>
      {children}
      {toast ? (
        <div
          key={toast.kind}
          role={toast.kind === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`falah-toast is-${toast.kind}`}
        >
          <span className="falah-toast__icon" aria-hidden>
            {toast.kind === 'saving' ? (
              <span className="falah-toast__spinner" />
            ) : toast.kind === 'success' ? (
              '✓'
            ) : (
              '!'
            )}
          </span>
          <span className="falah-toast__body">
            <span className="falah-toast__row">
              <span>{toast.kind === 'saving' ? toast.label : toast.message}</span>
              {toast.kind === 'saving' && (
                <span className="falah-toast__pct">{Math.round(toast.pct)}%</span>
              )}
            </span>
            {toast.kind === 'saving' && (
              <span
                className="falah-toast__bar"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(toast.pct)}
              >
                <span style={{ width: `${toast.pct}%` }} />
              </span>
            )}
          </span>
        </div>
      ) : null}
    </>
  )
}
