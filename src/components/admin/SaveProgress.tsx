'use client'

import { toast as payloadToast, useTranslation } from '@payloadcms/ui'
import { type ReactNode, useEffect, useState } from 'react'

type Stage = 'sending' | 'received' | 'preparing' | 'writing' | 'saved' | 'revalidating'

type Toast =
  | { kind: 'saving'; label: string; stage: Stage; pct: number }
  | { kind: 'success' | 'error'; message: string }

/**
 * Where each real stage puts the bar. Sending is measured in bytes (0–20%);
 * the rest are reported by the server as they happen (endpoints/saveWithProgress.ts).
 */
const STAGE_PCT: Record<Exclude<Stage, 'sending'>, number> = {
  received: 25,
  preparing: 35,
  writing: 50,
  saved: 80,
  revalidating: 90,
}

const STAGE_TEXT: Record<Stage, { en: string; id: string }> = {
  sending: { en: 'Sending changes', id: 'Mengirim perubahan' },
  received: { en: 'Received by the CMS', id: 'Diterima CMS' },
  preparing: { en: 'Preparing the data', id: 'Menyiapkan data' },
  writing: { en: 'Checking and saving', id: 'Memeriksa dan menyimpan' },
  saved: { en: 'Saved to the database', id: 'Tersimpan di database' },
  revalidating: { en: 'Updating the website', id: 'Memperbarui website' },
}

/** While our card is up, Payload's own save toast is hidden (see _motion.scss). */
const QUIET_CLASS = 'falah-save-quiet'

type Save = {
  publish: boolean
  url: URL
  target: 'collection' | 'global'
  slug: string
  id?: string
  data: Record<string, unknown>
}

/** A document save from the edit form: POST/PATCH to /api/<collection>[/<id>] or /api/globals/<slug>. */
function parseSave(input: RequestInfo | URL, init?: RequestInit): Save | null {
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase()
  if (method !== 'POST' && method !== 'PATCH') return null
  const url = new URL(input instanceof Request ? input.url : String(input), window.location.href)
  if (url.origin !== window.location.origin) return null
  // Autosave runs quietly in the background; login, preferences etc. are not saves.
  if (url.searchParams.get('autosave') === 'true') return null
  const match = /^\/api\/(?:(globals)\/([^/]+)|([^/]+)(?:\/([^/]+))?)$/.exec(url.pathname)
  if (!match) return null
  const [, isGlobal, globalSlug, collectionSlug, id] = match
  if (!isGlobal && /^(users|payload-preferences|payload-locked-documents|falah-save)$/.test(collectionSlug)) return null
  // Only plain form data: uploads (a file in the body) keep Payload's own request.
  const body = init?.body
  if (!(body instanceof FormData)) return null
  if ([...body.keys()].some((key) => key !== '_payload')) return null
  const raw = body.get('_payload')
  if (typeof raw !== 'string') return null
  let data: Record<string, unknown>
  try {
    data = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return null
  }
  return {
    publish: data._status === 'published',
    url,
    target: isGlobal ? 'global' : 'collection',
    slug: isGlobal ? globalSlug : collectionSlug,
    id,
    data,
  }
}

type Done = { status: number; body: unknown }

/**
 * Sends the save to /api/falah-save and reports real progress: bytes sent,
 * then each stage as the server reaches it. Resolves with what Payload's REST
 * API would have answered.
 */
function sendWithProgress(save: Save, onStage: (stage: Stage, pct: number) => void): Promise<Done> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/falah-save${save.url.search}`)
    xhr.withCredentials = true
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onStage('sending', (e.loaded / e.total) * 20)
    }

    let read = 0
    let done: Done | null = null
    const consume = () => {
      const text = xhr.responseText
      let newline: number
      while ((newline = text.indexOf('\n', read)) !== -1) {
        const line = text.slice(read, newline).trim()
        read = newline + 1
        if (!line) continue
        const event = JSON.parse(line) as
          | { type: 'stage'; stage: Exclude<Stage, 'sending'> }
          | { type: 'done'; status: number; body: unknown }
        if (event.type === 'stage') onStage(event.stage, STAGE_PCT[event.stage])
        else done = { status: event.status, body: event.body }
      }
    }
    xhr.onprogress = consume
    xhr.onload = () => {
      // Not a stream (e.g. signed out): pass the JSON answer through.
      if (!xhr.getResponseHeader('content-type')?.includes('ndjson')) {
        let body: unknown = {}
        try {
          body = JSON.parse(xhr.responseText)
        } catch {
          // Empty or not JSON.
        }
        resolve({ status: xhr.status, body })
        return
      }
      consume()
      if (done) resolve(done)
      else reject(new Error('The save was interrupted.'))
    }
    xhr.onerror = () => reject(new TypeError('Network error'))
    xhr.send(
      JSON.stringify({ target: save.target, slug: save.slug, id: save.id, data: save.data }),
    )
  })
}

/**
 * Saving or publishing from the edit form shows one card, in the visual
 * editor's toast design: the real progress (bytes sent, then each stage the
 * server reaches), then the result.
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
      const save = parseSave(input, init)
      if (!save) return original(input, init)

      const label = save.publish ? (id ? 'Memublikasikan…' : 'Publishing…') : id ? 'Menyimpan…' : 'Saving…'
      const mine = ++run
      window.clearTimeout(hideTimer)
      document.body.classList.add(QUIET_CLASS)
      let pct = 0
      const show = (stage: Stage, value: number) => {
        pct = Math.max(pct, value)
        if (mine === run) setToast({ kind: 'saving', label, stage, pct })
      }
      show('sending', 0)

      const finish = (next: Toast) => {
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
        const result = await sendWithProgress(save, show)
        const body = (result.body ?? {}) as { message?: string; errors?: { message?: string }[] }
        if (result.status < 400) {
          show('saved', 100)
          // Let the full bar show before the result replaces it.
          await new Promise((r) => window.setTimeout(r, 300))
          finish({ kind: 'success', message: body.message || (id ? 'Berhasil disimpan.' : 'Updated successfully.') })
        } else {
          finish({ kind: 'error', message: body.errors?.[0]?.message || body.message || `HTTP ${result.status}` })
        }
        return new Response(JSON.stringify(result.body ?? {}), {
          status: result.status,
          headers: { 'content-type': 'application/json' },
        })
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
              <>
                <span
                  className="falah-toast__bar"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(toast.pct)}
                >
                  <span style={{ width: `${toast.pct}%` }} />
                </span>
                <span className="falah-toast__stage">{STAGE_TEXT[toast.stage][id ? 'id' : 'en']}</span>
              </>
            )}
          </span>
        </div>
      ) : null}
    </>
  )
}
