'use client'

import {
  DefaultEditView,
  SetDocumentStepNav,
  useConfig,
  useDocumentInfo,
  useLocale,
  useTranslation,
} from '@payloadcms/ui'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

import { EditorSkeleton } from './skeletons'

/** Sent by the studio (frontend) once the editor has mounted. */
const READY_MESSAGE = 'falah-studio:ready'
/** The studio asks for the admin's session token (see the website's lib/studio/token.ts). */
const TOKEN_REQUEST = 'falah-studio:token-request'
const TOKEN_RESPONSE = 'falah-studio:token'
/** Never keep the placeholder up longer than this, even without the message. */
const READY_TIMEOUT_MS = 20_000

type Props = ComponentProps<typeof DefaultEditView> & { frontendUrl: string }

/**
 * Default view for Pages: the drag & drop visual editor (served by the
 * website at /studio) embedded inside the admin. The classic form stays in
 * the "Form" tab and is used to create new pages.
 */
export function VisualEditorView({ frontendUrl, ...props }: Props) {
  const { collectionSlug, id } = useDocumentInfo()
  const {
    config: {
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()
  const collectionConfig = collectionSlug ? getEntityConfig({ collectionSlug }) : undefined
  const locale = useLocale()
  const { i18n } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>()
  // The editor URL whose studio reported ready (switching language reloads it).
  const [readySrc, setReadySrc] = useState<string>()

  // Fill the space between the document header and the bottom of the window,
  // whatever the header / nav state is.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Leave room for the card's bottom spacing (--falah-visual-gap in custom.scss).
    const gap = parseFloat(getComputedStyle(el).marginBottom) || 0
    const fit = () =>
      setHeight(Math.max(560, window.innerHeight - el.getBoundingClientRect().top - gap))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(document.body)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  const ui = i18n.language === 'id' ? 'id' : 'en'
  const src = id ? `${frontendUrl}/studio/pages/${id}?locale=${locale.code}&ui=${ui}&embed=1` : ''

  // Show the editor skeleton until the studio says it's ready.
  useEffect(() => {
    if (!src) return
    const origin = new URL(frontendUrl).origin
    const onMessage = (event: MessageEvent) => {
      if (event.origin === origin && event.data?.type === READY_MESSAGE) setReadySrc(src)
    }
    window.addEventListener('message', onMessage)
    const timer = window.setTimeout(() => setReadySrc(src), READY_TIMEOUT_MS)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timer)
    }
  }, [frontendUrl, src])

  // Hand the session to the studio when it can't share the cookie (the site
  // on another domain). Only answers the website origin, only to its frame,
  // with a freshly refreshed token.
  useEffect(() => {
    const origin = new URL(frontendUrl).origin
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== origin || event.data?.type !== TOKEN_REQUEST || !event.source) return
      let token: string | null = null
      try {
        const res = await fetch(`${serverURL}${api}/users/refresh-token`, {
          method: 'POST',
          credentials: 'include',
        })
        if (res.ok) token = ((await res.json()) as { refreshedToken?: string }).refreshedToken ?? null
      } catch {
        // No session: the studio shows its "please log in" screen.
      }
      ;(event.source as Window).postMessage({ type: TOKEN_RESPONSE, token }, origin)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [frontendUrl, serverURL, api])

  if (!id) return <DefaultEditView {...props} />

  const ready = readySrc === src
  return (
    <div
      ref={ref}
      className={`falah-visual${ready ? ' is-ready' : ''}`}
      style={height ? { height } : undefined}
      aria-busy={!ready}
    >
      {/* Breadcrumb (Pages › title) — the default edit view sets it, this one must too. */}
      <SetDocumentStepNav
        collectionSlug={collectionSlug}
        id={id}
        pluralLabel={collectionConfig?.labels?.plural}
        useAsTitle={collectionConfig?.admin?.useAsTitle}
      />
      {ready ? null : (
        <div className="falah-visual__skeleton">
          <EditorSkeleton />
        </div>
      )}
      {/* Mount the editor only once the frame has its final size, so it lays
          itself out for the real width (not a phone-sized first paint). */}
      {height ? (
        <iframe
          key={src}
          className="falah-visual__frame"
          src={src}
          title={ui === 'id' ? 'Editor visual' : 'Visual editor'}
          allow="clipboard-read; clipboard-write"
        />
      ) : null}
    </div>
  )
}
