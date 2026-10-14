'use client'

import { type ReactNode, useRef } from 'react'

import { useAdminText } from './useAdminText'
import { useDomScan } from './useDomScan'

/** Payload prints "User: 1" when the lock only knows the user's id. */
const BY_ID = /^[^:]+:\s*(\d+)$/

const TEXT = {
  en: { someoneElse: 'Another user' },
  id: { someoneElse: 'Pengguna lain' },
}

/**
 * "Document locked": shows who is editing by name (or email) instead of the
 * "User: 1" Payload prints. Admins can look users up; for anyone else (or if
 * the lookup fails) it says "another user".
 */
export function DocumentLockNamesProvider({ children }: { children?: ReactNode }) {
  const t = useAdminText(TEXT)
  const names = useRef<Map<string, string>>(new Map())

  const scan = () => {
    for (const el of document.querySelectorAll<HTMLElement>(
      '.document-locked__content p:first-of-type strong:not([data-falah-named])',
    )) {
      const id = el.textContent?.trim().match(BY_ID)?.[1]
      if (!id) continue
      el.dataset.falahNamed = ''
      const known = names.current.get(id)
      if (known) {
        el.textContent = known
        continue
      }
      void fetch(`/api/users/${id}?depth=0&select[name]=true&select[email]=true`, {
        credentials: 'include',
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((user: { name?: string; email?: string } | null) => {
          const shown = user?.name?.trim() || user?.email || t.someoneElse
          names.current.set(id, shown)
          el.textContent = shown
        })
        .catch(() => {
          el.textContent = t.someoneElse
        })
    }
  }

  useDomScan(scan)
  return <>{children}</>
}
