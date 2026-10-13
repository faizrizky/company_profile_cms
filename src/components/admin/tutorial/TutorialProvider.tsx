'use client'

import { useAuth, useConfig, useRouteTransition } from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

import type { User } from '@/payload-types'
import {
  PICK_PARAM,
  TUTORIAL_MEASURE,
  TUTORIAL_MEASURED,
  TUTORIAL_PICK,
  TUTORIAL_PICK_RESULT,
  TUTORIAL_PICKED,
  type Rect,
} from '@/tutorial/messages'
import { uniqueSelector } from '@/tutorial/selector'
import { DEFAULT_TUTORIAL_STEPS, type TutorialStep } from '@/tutorial/steps'

import { useAdminLang, useAdminText } from '../useAdminText'
import { TUTORIAL_TEXT, type TutorialText } from './text'

/**
 * The guided tour: a spotlight that glides from element to element, across
 * pages and into the visual editor, with a card explaining each one.
 *
 * - Opens by itself for everyone who hasn't finished or skipped the current
 *   version (Settings → Tutorial → version), once the admin is ready (not on
 *   the login or two-step screens).
 * - Replayed from the Account page or the account menu (`useTutorial().start`).
 * - Survives a reload mid-way (sessionStorage).
 * - A window opened with ?falahTutorialPick=… is the element picker of the
 *   settings page instead (see TutorialTargetPicker).
 */

type Tour = { steps: TutorialStep[]; version: number; enabled: boolean }
type Run = Tour & { index: number; dir: 1 | -1 }

const SESSION_KEY = 'falah-tutorial'
const DISMISSED_KEY = 'falah-tutorial-dismissed'
export const MISSING_KEY = 'falah-tutorial-missing'

const TutorialContext = createContext<{ start: () => void; running: boolean }>({
  start: () => {},
  running: false,
})

export const useTutorial = () => useContext(TutorialContext)

// ── Storage (best effort: private windows may refuse it) ────────────────

function read<T>(storage: () => Storage, key: string): T | null {
  try {
    const raw = storage().getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write(storage: () => Storage, key: string, value: unknown) {
  try {
    if (value === null) storage().removeItem(key)
    else storage().setItem(key, JSON.stringify(value))
  } catch {
    // Not kept: the tour still runs, it just won't resume after a reload.
  }
}

const session = () => window.sessionStorage
const local = () => window.localStorage

/** Steps whose element couldn't be found, by id (shown on the settings page). */
function noteMissing(id: string, missing: boolean) {
  const list = read<Record<string, number>>(local, MISSING_KEY) ?? {}
  if (missing) list[id] = Date.now()
  else if (!(id in list)) return
  else delete list[id]
  write(local, MISSING_KEY, list)
}

// ── Geometry ─────────────────────────────────────────────────────────────

const visible = (el: Element) => {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0
}

function union(rects: DOMRect[]): Rect {
  const x = Math.min(...rects.map((r) => r.left))
  const y = Math.min(...rects.map((r) => r.top))
  const right = Math.max(...rects.map((r) => r.right))
  const bottom = Math.max(...rects.map((r) => r.bottom))
  return { x, y, width: right - x, height: bottom - y }
}

/**
 * Already selected (an active tab…): `clickFirst` leaves it alone, since
 * clicking an open tab may close it again.
 */
function isActive(el: Element) {
  for (let node: Element | null = el, i = 0; node && i < 3; node = node.parentElement, i++) {
    if ([...node.classList].some((c) => /(--|-is-|^is-)(active|selected|open)(?![a-z])/i.test(c))) return true
    if (['aria-selected', 'aria-pressed', 'aria-expanded'].some((a) => node!.getAttribute(a) === 'true')) return true
    if (node.getAttribute('aria-current') && node.getAttribute('aria-current') !== 'false') return true
  }
  return false
}

function query(selector: string): Element[] {
  try {
    return [...document.querySelectorAll(selector)].filter(visible)
  } catch {
    return [] // An invalid selector typed in the settings: treated as not found.
  }
}

const sameRect = (a: Rect | null, b: Rect | null) =>
  a === b ||
  Boolean(
    a &&
      b &&
      Math.abs(a.x - b.x) < 1 &&
      Math.abs(a.y - b.y) < 1 &&
      Math.abs(a.width - b.width) < 1 &&
      Math.abs(a.height - b.height) < 1,
  )

/** Where the card goes: below, above, beside the highlight, or centred. */
function placeCard(rect: Rect | null, w: number, h: number) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pad = 16
  const gap = 18
  const clampX = (x: number) => Math.min(Math.max(pad, x), vw - w - pad)
  const clampY = (y: number) => Math.min(Math.max(pad, y), vh - h - pad)
  if (!rect) return { left: clampX((vw - w) / 2), top: clampY((vh - h) / 2) }
  const midX = rect.x + rect.width / 2 - w / 2
  const midY = rect.y + rect.height / 2 - h / 2
  if (vh - (rect.y + rect.height) >= h + gap + pad) return { left: clampX(midX), top: rect.y + rect.height + gap }
  if (rect.y >= h + gap + pad) return { left: clampX(midX), top: rect.y - h - gap }
  if (vw - (rect.x + rect.width) >= w + gap + pad) return { left: rect.x + rect.width + gap, top: clampY(midY) }
  if (rect.x >= w + gap + pad) return { left: rect.x - w - gap, top: clampY(midY) }
  // Covers (almost) the whole screen: the card sits at the bottom, over it.
  return { left: clampX((vw - w) / 2), top: vh - h - pad }
}

// ── Provider ─────────────────────────────────────────────────────────────

const noopSubscribe = () => () => {}

const PICK_KEY = 'falah-tutorial-pick'

/**
 * The picker token of this window (?falahTutorialPick=…); null on the server
 * and normally. Kept for the window's lifetime (sessionStorage is per window):
 * list views rewrite the query string as they load.
 */
function readPickToken() {
  const fromUrl = new URLSearchParams(window.location.search).get(PICK_PARAM)
  try {
    if (fromUrl) window.sessionStorage.setItem(PICK_KEY, fromUrl)
    return fromUrl ?? window.sessionStorage.getItem(PICK_KEY)
  } catch {
    return fromUrl
  }
}

function usePickToken() {
  return useSyncExternalStore(noopSubscribe, readPickToken, () => null)
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth<User>()
  const { config } = useConfig()
  const pickToken = usePickToken()
  const api = `${config.serverURL}${config.routes.api}`
  const adminRoute = config.routes.admin

  const [run, setRun] = useState<Run | null>(null)

  const loadTour = useCallback(async (): Promise<Tour | null> => {
    if (!user) return null
    const res = await fetch(`${api}/globals/tutorial?depth=0`, { credentials: 'include' }).catch(() => null)
    const data = res?.ok
      ? ((await res.json()) as { steps?: TutorialStep[]; version?: number; enabled?: boolean; updatedAt?: string })
      : {}
    // Until the settings page is first saved, the default steps run.
    const steps = Array.isArray(data.steps) && (data.steps.length || data.updatedAt) ? data.steps : DEFAULT_TUTORIAL_STEPS
    const roles = user.roles ?? []
    return {
      enabled: data.enabled ?? true,
      version: data.version ?? 1,
      steps: steps.filter((s) => s.enabled !== false && (!s.roles?.length || s.roles.some((r) => roles.includes(r)))),
    }
  }, [api, user])

  const start = useCallback(() => {
    void loadTour().then((tour) => {
      if (tour?.steps.length) setRun({ ...tour, index: 0, dir: 1 })
    })
  }, [loadTour])

  // Opens by itself (or resumes after a reload) once the admin is ready.
  const userId = user?.id
  useEffect(() => {
    if (!userId || pickToken) return
    let cancelled = false
    let timer: number | undefined
    void loadTour().then((tour) => {
      if (cancelled || !tour?.steps.length) return
      const resume = read<{ version: number; index: number }>(session, SESSION_KEY)
      const seen = (user as { tutorialSeen?: number | null } | null)?.tutorialSeen ?? 0
      const dismissed = read<number>(session, DISMISSED_KEY) ?? 0
      const index = resume?.version === tour.version ? Math.min(resume.index, tour.steps.length - 1) : 0
      if (!resume && (!tour.enabled || seen >= tour.version || dismissed >= tour.version)) return
      // Signed in for real: the menu is there and the two-step screen is gone.
      const ready = () => document.querySelector('.nav') && !document.querySelector('.falah-2fa')
      const wait = () => {
        if (cancelled) return
        if (ready()) setRun((current) => current ?? { ...tour, index, dir: 1 })
        else timer = window.setTimeout(wait, 500)
      }
      timer = window.setTimeout(wait, 800)
    })
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
    // Once per signed-in user; `user` itself changes on every token refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, pickToken, loadTour])

  useEffect(() => {
    if (run) write(session, SESSION_KEY, { version: run.version, index: run.index })
  }, [run])

  const finish = useCallback(() => {
    if (!run) return
    write(session, SESSION_KEY, null)
    write(session, DISMISSED_KEY, run.version)
    setRun(null)
    if (user) {
      // Finished or skipped: this version won't open by itself again.
      void fetch(`${api}/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tutorialSeen: run.version }),
      }).catch(() => {})
    }
  }, [api, run, user])

  return (
    <TutorialContext.Provider value={{ start, running: Boolean(run) }}>
      {children}
      {pickToken ? <PickMode token={pickToken} adminRoute={adminRoute} /> : null}
      {run && !pickToken ? <Tour run={run} setRun={setRun} finish={finish} adminRoute={adminRoute} api={api} /> : null}
    </TutorialContext.Provider>
  )
}

// ── The tour ─────────────────────────────────────────────────────────────

const joinAdmin = (adminRoute: string, route?: string | null) => {
  const path = (route ?? '').trim()
  const full = `${adminRoute}${path && !path.startsWith('/') ? '/' : ''}${path}`.split('?')[0]
  return full.length > 1 ? full.replace(/\/$/, '') : full
}

// Collections with a drag & drop order: their "first" document is the first in that order.
const ORDERED = new Set(['certifications', 'partners', 'solution-categories', 'products'])

/**
 * Route placeholders, resolved when the step opens:
 * - `/collections/<slug>/{first}…`: the collection's first document, rather
 *   than `/create` (on collections with autosave, merely opening the create
 *   page makes a new draft for every user who runs the tour);
 * - `…/<id>/versions/{version}`: an earlier version of that document, to
 *   show the compare view.
 * Resolves to null when there is nothing to open.
 */
async function resolveRoute(api: string, route: string): Promise<string | null> {
  const get = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' }).catch(() => null)
    return res?.ok ? ((await res.json()) as { docs?: { id: string | number }[] }) : null
  }
  let path = route
  const first = path.match(/^\/collections\/([\w-]+)\/\{first\}/)
  if (first) {
    const sort = ORDERED.has(first[1]) ? '_order' : '-createdAt'
    const id = (await get(`${api}/${first[1]}?limit=1&depth=0&sort=${sort}`))?.docs?.[0]?.id
    if (id === undefined) return null
    path = path.replace('{first}', String(id))
  }
  const version = path.match(/^\/collections\/([\w-]+)\/([\w-]+)\/versions\/\{version\}/)
  if (version) {
    const docs = (
      await get(`${api}/${version[1]}/versions?where[parent][equals]=${version[2]}&sort=-updatedAt&limit=2&depth=0`)
    )?.docs
    // The one before the latest, so the compare view has changes to show.
    const id = (docs?.[1] ?? docs?.[0])?.id
    if (id === undefined) return null
    path = path.replace('{version}', String(id))
  }
  return path
}

const hasPlaceholder = (route: string) => /\{(first|version)\}/.test(route)

/** Asks the visual editor where `selector` is (null: not there, or no answer). */
function measureInEditor(selector: string, click: string | undefined, scroll: boolean) {
  const frame = document.querySelector<HTMLIFrameElement>('.falah-visual__frame')
  if (!frame?.contentWindow || !visible(frame)) return Promise.resolve(null)
  let origin: string
  try {
    origin = new URL(frame.src).origin
  } catch {
    return Promise.resolve(null)
  }
  const id = Math.random().toString(36).slice(2)
  return new Promise<{ rect: Rect | null; clicked: boolean } | null>((resolve) => {
    const done = (value: { rect: Rect | null; clicked: boolean } | null) => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timer)
      resolve(value)
    }
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin || event.data?.type !== TUTORIAL_MEASURED || event.data.id !== id) return
      const r = event.data.rect as Rect | null
      if (!r) return done({ rect: null, clicked: Boolean(event.data.clicked) })
      // Into the admin's viewport, cut to the editor's frame.
      const box = frame.getBoundingClientRect()
      const x = Math.max(box.left, box.left + r.x)
      const y = Math.max(box.top, box.top + r.y)
      const right = Math.min(box.right, box.left + r.x + r.width)
      const bottom = Math.min(box.bottom, box.top + r.y + r.height)
      done({
        rect: right > x && bottom > y ? { x, y, width: right - x, height: bottom - y } : null,
        clicked: Boolean(event.data.clicked),
      })
    }
    const timer = window.setTimeout(() => done(null), 800)
    window.addEventListener('message', onMessage)
    frame.contentWindow!.postMessage({ type: TUTORIAL_MEASURE, id, selector, click, scroll }, origin)
  })
}

/** Resolves when a smooth scroll is over (or after a short while). */
function scrollEnd() {
  return new Promise<void>((resolve) => {
    let timer = 0
    const done = () => {
      window.removeEventListener('scrollend', done, true)
      window.clearTimeout(timer)
      resolve()
    }
    window.addEventListener('scrollend', done, true)
    timer = window.setTimeout(done, 900)
  })
}

function Tour({
  run,
  setRun,
  finish,
  adminRoute,
  api,
}: {
  run: Run
  setRun: (run: Run | null) => void
  finish: () => void
  adminRoute: string
  api: string
}) {
  const t = useAdminText(TUTORIAL_TEXT)
  const lang = useAdminLang()
  const router = useRouter()
  const pathname = usePathname()
  const { startRouteTransition } = useRouteTransition()
  const titleId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  // Set while the page scrolls: the highlight is moved directly (see below).
  const following = useRef(false)

  const step = run.steps[run.index]
  const total = run.steps.length
  // Placeholders ({first}, {version}) resolved once per route; null: nothing to open.
  const rawRoute = (step.route ?? '').trim()
  const needsResolve = hasPlaceholder(rawRoute)
  const [resolved, setResolved] = useState<Record<string, string | null>>({})
  useEffect(() => {
    if (!needsResolve || rawRoute in resolved) return
    let cancelled = false
    void resolveRoute(api, rawRoute).then((path) => {
      if (!cancelled) setResolved((r) => ({ ...r, [rawRoute]: path }))
    })
    return () => {
      cancelled = true
    }
  }, [api, needsResolve, rawRoute, resolved])
  const resolvedPath = needsResolve ? resolved[rawRoute] : rawRoute
  const targetPath =
    resolvedPath === undefined
      ? null // Still looking it up.
      : resolvedPath === null
        ? '' // Nothing to open: skipped below.
        : joinAdmin(adminRoute, resolvedPath)
  // What is on screen: the step shown and its element (null: centred card).
  const [shown, setShown] = useState<{ index: number; rect: Rect | null } | null>(null)
  const [card, setCard] = useState({ w: 360, h: 200 })
  const navigatedFrom = useRef<{ index: number; from: string } | null>(null)

  const go = useCallback(
    (dir: 1 | -1) => {
      const index = run.index + dir
      if (index < 0) return
      if (index >= total) finish()
      else setRun({ ...run, index, dir })
    },
    [finish, run, setRun, total],
  )

  // Skipped quietly when its element isn't found, in the direction of travel.
  const skip = useCallback(() => {
    noteMissing(step.id, true)
    const index = run.index + run.dir
    if (index < 0) setRun({ ...run, index: 0, dir: 1 })
    else if (index >= total) finish()
    else setRun({ ...run, index })
  }, [finish, run, setRun, step.id, total])

  // 1. Be on the step's page.
  const onPage = Boolean(targetPath) && pathname === targetPath
  useEffect(() => {
    if (targetPath === null) return
    if (targetPath === '') {
      skip()
      return
    }
    if (onPage) {
      navigatedFrom.current = null
      return
    }
    const nav = navigatedFrom.current
    if (nav?.index === run.index) {
      // Sent elsewhere (no access, redirect…): this step can't be shown.
      if (pathname !== nav.from) skip()
      return
    }
    navigatedFrom.current = { index: run.index, from: pathname }
    startRouteTransition(() => router.push(targetPath))
    // Generous: a slow server (or a dev build compiling the page) must not skip the step.
    const timer = window.setTimeout(skip, 30_000)
    return () => window.clearTimeout(timer)
  }, [onPage, pathname, router, run.index, skip, startRouteTransition, targetPath])

  // 2. Find the element (clicking `clickFirst` before), then follow it.
  useEffect(() => {
    if (!onPage) return
    const target = step.target?.trim()
    // No element: a centred card (see `centered` below).
    if (!target) return
    const inEditor = step.frame === 'editor'
    // `clickFirst` may list several clicks, in order, separated by ";;"
    // (e.g. collapse every section, then open one). Already-open ones are left alone.
    const clicks = (step.clickFirst ?? '')
      .split(';;')
      .map((c) => c.trim())
      .filter(Boolean)
    let nextClick = 0
    let clicked = clicks.length === 0
    let found = false
    let cancelled = false
    let timer: number | undefined
    const deadline = Date.now() + (inEditor ? 25_000 : 8_000)

    const measure = async (): Promise<Rect | null> => {
      if (inEditor) {
        const answer = await measureInEditor(target, clicked ? undefined : clicks[0], !found)
        if (answer?.clicked) clicked = true
        return answer?.rect ?? null
      }
      if (!clicked) {
        // One click per round, so each opening renders before the next.
        const button = query(clicks[nextClick])[0] as HTMLElement | undefined
        if (!button) return null
        nextClick += 1
        clicked = nextClick >= clicks.length
        if (!isActive(button)) button.click()
        return null
      }
      const els = query(target)
      if (!els.length) return null
      if (!found) {
        const r = els[0].getBoundingClientRect()
        const tall = r.height > window.innerHeight - 160
        if (r.top < 60 || r.bottom > window.innerHeight - 16) {
          // Scroll smoothly and wait for it: the highlight then glides once,
          // to where the element ends up.
          els[0].scrollIntoView({ behavior: 'smooth', block: tall ? 'start' : 'center' })
          await scrollEnd()
        }
      }
      return union(els.map((el) => el.getBoundingClientRect()))
    }

    const tick = async () => {
      const rect = await measure()
      if (cancelled) return
      if (rect && clicked) {
        if (!found) noteMissing(step.id, false)
        found = true
        if (following.current) {
          timer = window.setTimeout(tick, 150)
          return
        }
        setShown((prev) =>
          prev?.index === run.index && sameRect(prev.rect, rect) ? prev : { index: run.index, rect },
        )
      } else if (!found && Date.now() > deadline) {
        skip()
        return
      }
      // Follows the element while it moves (scrolling, layout changes).
      timer = window.setTimeout(tick, found ? 150 : 250)
    }
    void tick()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [onPage, run.index, skip, step])

  const pad = 8
  const centered = !step.target?.trim()
  const ready = centered ? onPage : shown?.index === run.index
  // Until the next one is found, the highlight stays where it was, then glides.
  const rect = centered && onPage ? null : (shown?.rect ?? null)

  // The highlight glides only when it moves to another step; later small
  // adjustments (layout settling, charts animating) apply at once, so the
  // glide never restarts half-way. Decided while rendering, so the glide is
  // on in the very frame the new position is (an effect would come too late:
  // the highlight would jump).
  const glideKey = `${shown?.index}|${centered && onPage}`
  const [settled, setSettled] = useState(glideKey)
  const gliding = glideKey !== settled
  useEffect(() => {
    if (!gliding) return
    const timer = window.setTimeout(() => setSettled(glideKey), 650)
    return () => window.clearTimeout(timer)
  }, [gliding, glideKey])

  // While the page scrolls (or the window resizes), the highlight and the card
  // follow the element on screen frame by frame — also while scrolling to the
  // next step's element, so the highlight moves with the page, then glides —
  // written straight to the DOM with the glide turned off; React catches up
  // once it stops. Elements inside the visual editor are followed by the
  // regular check.
  const followIndex = shown?.index
  const followStep = followIndex === undefined ? undefined : run.steps[followIndex]
  useEffect(() => {
    const target = followStep?.target?.trim()
    // Not over another page, nor over the centred card of a step without an element.
    if (!onPage || centered || followIndex === undefined || !target || followStep?.frame === 'editor') return
    let frame = 0
    let idle: number | undefined
    const root = rootRef.current
    const place = () => {
      frame = 0
      const els = query(target)
      const spotEl = spotRef.current
      const cardEl = cardRef.current
      if (!els.length || !spotEl || !cardEl) return
      const r = union(els.map((el) => el.getBoundingClientRect()))
      const box = { x: r.x - pad, y: r.y - pad, width: r.width + pad * 2, height: r.height + pad * 2 }
      spotEl.style.top = `${box.y}px`
      spotEl.style.left = `${box.x}px`
      spotEl.style.width = `${box.width}px`
      spotEl.style.height = `${box.height}px`
      const at = placeCard(box, cardEl.offsetWidth, cardEl.offsetHeight)
      cardEl.style.top = `${at.top}px`
      cardEl.style.left = `${at.left}px`
      return r
    }
    const onMove = () => {
      following.current = true
      // An attribute, not a class: React owns the class list.
      root?.setAttribute('data-following', '')
      if (!frame) frame = requestAnimationFrame(place)
      window.clearTimeout(idle)
      idle = window.setTimeout(() => {
        const r = place()
        following.current = false
        root?.removeAttribute('data-following')
        if (r) setShown((prev) => (prev?.index === followIndex ? { index: followIndex, rect: r } : prev))
      }, 160)
    }
    window.addEventListener('scroll', onMove, { capture: true, passive: true })
    window.addEventListener('resize', onMove)
    return () => {
      window.removeEventListener('scroll', onMove, { capture: true })
      window.removeEventListener('resize', onMove)
      cancelAnimationFrame(frame)
      window.clearTimeout(idle)
      following.current = false
      root?.removeAttribute('data-following')
    }
  }, [centered, followIndex, followStep, onPage])


  // The card's size, for placing it.
  useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setCard({ w: el.offsetWidth, h: el.offsetHeight }))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (ready) nextRef.current?.focus({ preventScroll: true })
  }, [ready, run.index])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish()
      else if (event.key === 'ArrowRight' && ready) go(1)
      else if (event.key === 'ArrowLeft' && run.index > 0) go(-1)
      else return
      event.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [finish, go, ready, run.index])

  // Re-place on resize (the highlight follows by itself).
  const [, setViewport] = useState(0)
  useEffect(() => {
    const onResize = () => setViewport((n) => n + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const spot = rect
    ? { top: rect.y - pad, left: rect.x - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : // Not 0×0: browsers don't paint the shadow (the dimming) of an empty box.
      { top: window.innerHeight / 2 - 1, left: window.innerWidth / 2 - 1, width: 2, height: 2 }
  const position = placeCard(rect ? { x: spot.left, y: spot.top, width: spot.width, height: spot.height } : null, card.w, card.h)
  const title = (lang === 'id' ? step.titleId || step.titleEn : step.titleEn || step.titleId) ?? ''
  const body = (lang === 'id' ? step.bodyId || step.bodyEn : step.bodyEn || step.bodyId) ?? ''
  const last = run.index === total - 1

  return createPortal(
    <div ref={rootRef} className={`falah-tour${gliding ? ' is-gliding' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div ref={spotRef} className={`falah-tour__spot${rect ? '' : ' is-centered'}`} style={spot} aria-hidden />
      <div ref={cardRef} className={`falah-tour__card${ready ? '' : ' is-loading'}`} style={position}>
        <div className="falah-tour__meta">
          <span className="falah-tour__badge">{t.tour}</span>
          <span className="falah-tour__count">{t.of(run.index + 1, total)}</span>
        </div>
        <h2 id={titleId} className="falah-tour__title">
          {title}
        </h2>
        <StepBody text={body} />
        <div className="falah-tour__progress" aria-hidden>
          <span style={{ width: `${((run.index + 1) / total) * 100}%` }} />
        </div>
        <div className="falah-tour__actions">
          <button type="button" className="falah-tour__skip" onClick={finish}>
            {t.skip}
          </button>
          <span className="falah-tour__nav">
            {run.index > 0 ? (
              <button type="button" className="falah-tour__back" onClick={() => go(-1)}>
                {t.back}
              </button>
            ) : null}
            <button
              ref={nextRef}
              type="button"
              className="falah-tour__next"
              onClick={() => go(1)}
              disabled={!ready}
              aria-busy={!ready}
            >
              {ready ? (last ? t.done : t.next) : t.loading}
            </button>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * A step's text: paragraphs, and lines starting with "- " as bullet points
 * (for steps that explain several things at once).
 */
function StepBody({ text }: { text: string }) {
  const blocks: ({ kind: 'p'; text: string } | { kind: 'ul'; items: string[] })[] = []
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const bullet = line.match(/^[-•]\s+(.*)$/)
    const lastBlock = blocks.at(-1)
    if (bullet) {
      if (lastBlock?.kind === 'ul') lastBlock.items.push(bullet[1])
      else blocks.push({ kind: 'ul', items: [bullet[1]] })
    } else blocks.push({ kind: 'p', text: line })
  }
  return (
    <div className="falah-tour__body">
      {blocks.map((b, i) =>
        b.kind === 'p' ? (
          <p key={i}>{b.text}</p>
        ) : (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}

// ── Element picker (a window opened by the settings page) ───────────────

function PickMode({ token, adminRoute }: { token: string; adminRoute: string }) {
  const t: TutorialText = useAdminText(TUTORIAL_TEXT)
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState<Rect | null>(null)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = () => document.querySelector<HTMLIFrameElement>('.falah-visual__frame')
    const frameOrigin = () => {
      try {
        return new URL(frame()?.src ?? '').origin
      } catch {
        return null
      }
    }
    const send = (selector: string, where: 'admin' | 'editor') => {
      const route = window.location.pathname.slice(adminRoute.length) || ''
      window.opener?.postMessage(
        { type: TUTORIAL_PICK_RESULT, token, selector, frame: where, route },
        window.location.origin,
      )
      window.close()
    }
    const toEditor = (on: boolean) => {
      const origin = frameOrigin()
      if (origin) frame()?.contentWindow?.postMessage({ type: TUTORIAL_PICK, on }, origin)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') window.close()
    }
    window.addEventListener('keydown', onKey)
    if (paused) {
      toEditor(false)
      return () => window.removeEventListener('keydown', onKey)
    }

    const ours = (el: Element | null) => !el || bannerRef.current?.contains(el)
    const onMove = (event: MouseEvent) => {
      const el = document.elementFromPoint(event.clientX, event.clientY)
      // Over the visual editor, its own picker takes over.
      setHover(ours(el) || el?.localName === 'iframe' ? null : union([el!.getBoundingClientRect()]))
    }
    const block = (event: Event) => {
      if (ours(event.target as Element)) return
      event.preventDefault()
      event.stopPropagation()
    }
    const onClick = (event: MouseEvent) => {
      const el = event.target as Element
      if (ours(el)) return
      block(event)
      send(uniqueSelector(el), 'admin')
    }
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== TUTORIAL_PICKED || event.source !== frame()?.contentWindow) return
      if (event.origin !== frameOrigin()) return
      send(String(event.data.selector), 'editor')
    }
    document.addEventListener('mousemove', onMove, true)
    document.addEventListener('pointerdown', block, true)
    document.addEventListener('mousedown', block, true)
    document.addEventListener('click', onClick, true)
    window.addEventListener('message', onMessage)
    // The editor loads later (and may reload): keep telling it.
    toEditor(true)
    const timer = window.setInterval(() => toEditor(true), 1000)
    return () => {
      document.removeEventListener('mousemove', onMove, true)
      document.removeEventListener('pointerdown', block, true)
      document.removeEventListener('mousedown', block, true)
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('message', onMessage)
      window.removeEventListener('keydown', onKey)
      window.clearInterval(timer)
      toEditor(false)
    }
  }, [adminRoute, paused, token])

  return createPortal(
    <>
      {hover && !paused ? (
        <div
          className="falah-tour-pick__hover"
          style={{ top: hover.y - 4, left: hover.x - 4, width: hover.width + 8, height: hover.height + 8 }}
          aria-hidden
        />
      ) : null}
      <div ref={bannerRef} className="falah-tour-pick" role="status">
        <span className="falah-tour-pick__text">
          {paused ? t.pickPause : t.pickBanner}
          <small>{t.pickEditor}</small>
        </span>
        <button type="button" onClick={() => setPaused((p) => !p)}>
          {paused ? t.pickResume : t.pickPause}
        </button>
        <button type="button" onClick={() => window.close()}>
          {t.pickCancel}
        </button>
      </div>
    </>,
    document.body,
  )
}
