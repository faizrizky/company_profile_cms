'use client'

import { useId, type JSX } from 'react'

/** Round-crop friendly flags (square viewBox) for the language switches. */
function FlagId() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden>
      <rect width="30" height="15" fill="#ce1126" />
      <rect y="15" width="30" height="15" fill="#fff" />
    </svg>
  )
}

function FlagGb() {
  const clip = useId()
  return (
    <svg viewBox="15 0 30 30" aria-hidden>
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clip})`}
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  )
}

export const flags: Record<string, () => JSX.Element> = { en: FlagGb, id: FlagId }
