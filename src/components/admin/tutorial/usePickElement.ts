'use client'

import { toast, useConfig } from '@payloadcms/ui'
import { useCallback, useEffect, useRef, useState } from 'react'

import { PICK_PARAM, TUTORIAL_PICK_RESULT } from '@/tutorial/messages'
import type { TutorialFrame } from '@/tutorial/steps'

import { useAdminText } from '../useAdminText'
import { TUTORIAL_TEXT } from './text'

export type Picked = { selector: string; frame: TutorialFrame; route: string }

/**
 * "Pick element": opens a step's page in a window that turns into an element
 * picker (see PickMode in TutorialProvider); the admin's click comes back as
 * the page, where the element is, and its selector.
 */
export function usePickElement() {
  const { config } = useConfig()
  const t = useAdminText(TUTORIAL_TEXT)
  const [waiting, setWaiting] = useState(false)
  const stop = useRef<(() => void) | null>(null)

  useEffect(() => () => stop.current?.(), [])

  const pick = useCallback(
    (route: string, onPicked: (picked: Picked) => void) => {
      stop.current?.()
      const token = Math.random().toString(36).slice(2)
      const page = route.trim()
      const url = `${config.routes.admin}${page && !page.startsWith('/') ? '/' : ''}${page}`
      const win = window.open(
        `${url}${url.includes('?') ? '&' : '?'}${PICK_PARAM}=${token}`,
        'falah-tutorial-pick',
        'width=1440,height=900',
      )
      if (!win) {
        toast.error(t.pickBlocked)
        return
      }
      setWaiting(true)
      const cleanup = () => {
        window.removeEventListener('message', onMessage)
        window.clearInterval(closed)
        setWaiting(false)
        stop.current = null
      }
      const onMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.source !== win) return
        if (event.data?.type !== TUTORIAL_PICK_RESULT || event.data.token !== token) return
        onPicked({
          selector: String(event.data.selector),
          frame: event.data.frame === 'editor' ? 'editor' : 'admin',
          route: String(event.data.route ?? ''),
        })
        toast.success(t.picked)
        cleanup()
      }
      // The window closed without a pick.
      const closed = window.setInterval(() => win.closed && cleanup(), 500)
      window.addEventListener('message', onMessage)
      stop.current = cleanup
    },
    [config.routes.admin, t],
  )

  return { pick, waiting }
}
