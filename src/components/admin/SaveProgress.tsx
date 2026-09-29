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
function sendWithProgress(
  search: string,
  body: string,
  onStage: (stage: Stage, pct: number) => void,
): Promise<Done> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/falah-save${search}`)
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
    xhr.send(body)
  })
}

/** The visual editor (an iframe of the website) asks the CMS page to save for it. */
const STUDIO_SAVE = 'falah-studio:save'
const STUDIO_SAVE_ACCEPTED = 'falah-studio:save-accepted'
const STUDIO_SAVE_DONE = 'falah-studio:save-done'

/**
 * Saving or publishing shows one card, in the visual editor's toast design:
 * the real progress (bytes sent, then each stage the server reaches), then
 * the result. It covers saves from the edit form and from the embedded visual
 * editor — the editor hands its save to this page, so switching tabs or
 * leaving the editor doesn't cut it off. While a save runs the page is locked.
 */
export function SaveProgressProvider({ children }: { children?: ReactNode }) {
  const { i18n } = useTranslation()
  const id = i18n.language === 'id'
  const [toast, setToast] = useState<Toast | null>(null)
  const saving = toast?.kind === 'saving'

  // Closing or reloading the tab mid-save asks first.
  useEffect(() => {
    if (!saving) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [saving])

  useEffect(() => {
    // Payload can mount providers more than once (and dev mounts effects
    // twice): wrap fetch only once, or each wrapper would show its own card.
    const current = window.fetch as typeof window.fetch & { __falahSaveProgress?: true }
    if (current.__falahSaveProgress) return
    const original = window.fetch
    let run = 0
    let hideTimer: number | undefined

    /** Runs one save with the progress card and returns what REST would answer. */
    const runSave = async (search: string, body: string, publish: boolean): Promise<Done> => {
      const label = publish ? (id ? 'Memublikasikan…' : 'Publishing…') : id ? 'Menyimpan…' : 'Saving…'
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
        const result = await sendWithProgress(search, body, show)
        const answer = (result.body ?? {}) as { message?: string; errors?: { message?: string }[] }
        if (result.status < 400) {
          show('saved', 100)
          // Let the full bar show before the result replaces it.
          await new Promise((r) => window.setTimeout(r, 300))
          finish({ kind: 'success', message: answer.message || (id ? 'Berhasil disimpan.' : 'Updated successfully.') })
        } else {
          finish({ kind: 'error', message: answer.errors?.[0]?.message || answer.message || `HTTP ${result.status}` })
        }
        return result
      } catch (error) {
        finish({ kind: 'error', message: (error as Error).message || 'Error' })
        throw error
      }
    }

    // Saves from the edit form.
    const wrapped = async (input: RequestInfo | URL, init?: RequestInit) => {
      const save = parseSave(input, init)
      if (!save) return original(input, init)
      const result = await runSave(
        save.url.search,
        JSON.stringify({ target: save.target, slug: save.slug, id: save.id, data: save.data }),
        save.publish,
      )
      return new Response(JSON.stringify(result.body ?? {}), {
        status: result.status,
        headers: { 'content-type': 'application/json' },
      })
    }
    window.fetch = Object.assign(wrapped, { __falahSaveProgress: true as const })

    // Saves handed over by the visual editor. Only its own frame may ask.
    const onMessage = async (event: MessageEvent) => {
      if (event.data?.type !== STUDIO_SAVE) return
      const frame = document.querySelector<HTMLIFrameElement>('iframe.falah-visual__frame')
      if (!frame || event.source !== frame.contentWindow || new URL(frame.src).origin !== event.origin) return
      const { requestId, search, body, publish } = event.data as {
        requestId: string
        search: string
        body: string
        publish: boolean
      }
      if (typeof search !== 'string' || typeof body !== 'string') return
      const reply = (message: Record<string, unknown>) => {
        try {
          // The editor may be gone by now (tab switched): the save still finishes here.
          ;(event.source as Window | null)?.postMessage({ requestId, ...message }, event.origin)
        } catch {
          // Nothing to tell.
        }
      }
      reply({ type: STUDIO_SAVE_ACCEPTED })
      try {
        const result = await runSave(search.startsWith('?') ? search : `?${search}`, body, Boolean(publish))
        reply({ type: STUDIO_SAVE_DONE, status: result.status, body: result.body })
      } catch (error) {
        reply({ type: STUDIO_SAVE_DONE, status: 0, body: { errors: [{ message: (error as Error).message }] } })
      }
    }
    window.addEventListener('message', onMessage)

    return () => {
      if (window.fetch === wrapped) window.fetch = original
      window.removeEventListener('message', onMessage)
      window.clearTimeout(hideTimer)
      document.body.classList.remove(QUIET_CLASS)
    }
  }, [id])

  return (
    <>
      {children}
      {/* While saving, nothing on the page can be clicked (sidebar, tabs, editor). */}
      {saving ? <div className="falah-save-lock" aria-hidden /> : null}
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
