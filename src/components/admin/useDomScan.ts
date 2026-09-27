'use client'

import { useEffect, useRef } from 'react'

const CHILD_LIST: MutationObserverInit = { childList: true, subtree: true }

/**
 * Runs `scan` now and again after the admin's DOM changes (batched: at most
 * once per task, or per animation frame). For providers that enhance
 * Payload's own markup, which has no hooks of its own. `scan` should be
 * idempotent (mark what it has handled).
 */
export function useDomScan(
  scan: () => void,
  {
    observe = CHILD_LIST,
    timing = 'task',
  }: { observe?: MutationObserverInit; timing?: 'task' | 'frame' } = {},
) {
  // Read once: the observer is set up a single time.
  const options = useRef({ observe, timing })

  useEffect(() => {
    const { observe: init, timing: when } = options.current
    let pending = 0
    const run = () => {
      pending = 0
      scan()
    }
    const schedule = () => {
      if (!pending)
        pending = when === 'frame' ? requestAnimationFrame(run) : window.setTimeout(run, 0)
    }
    const cancel = () =>
      when === 'frame' ? cancelAnimationFrame(pending) : window.clearTimeout(pending)

    run()
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, init)
    return () => {
      observer.disconnect()
      cancel()
    }
  }, [scan])
}
