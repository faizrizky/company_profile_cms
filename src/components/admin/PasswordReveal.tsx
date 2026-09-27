'use client'

import type { ReactNode } from 'react'

import { useDomScan } from './useDomScan'

const EYE =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>'
const EYE_OFF =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.7 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a18.5 18.5 0 0 1-2.2 3.2M6.6 6.6A18.4 18.4 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m2 2 20 20"/></svg>'

const labels = {
  en: { show: 'Show password', hide: 'Hide password' },
  id: { show: 'Tampilkan password', hide: 'Sembunyikan password' },
}

function lang() {
  return document.documentElement.lang?.startsWith('id') ? labels.id : labels.en
}

function enhance(input: HTMLInputElement) {
  const wrap = input.parentElement
  if (!wrap) return
  input.setAttribute('data-reveal', '')

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'falah-reveal'
  const render = () => {
    const visible = input.type === 'text'
    const text = lang()
    button.innerHTML = visible ? EYE_OFF : EYE
    button.setAttribute('aria-label', visible ? text.hide : text.show)
    button.setAttribute('aria-pressed', String(visible))
    button.title = visible ? text.hide : text.show
  }
  // Keep the caret in the input while toggling.
  button.addEventListener('mousedown', (event) => event.preventDefault())
  button.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password'
    render()
  })
  render()
  wrap.appendChild(button)
}

const scanPasswordInputs = () => {
  document
    .querySelectorAll<HTMLInputElement>('input[type="password"]:not([data-reveal])')
    .forEach(enhance)
}
/**
 * Admin-wide provider that adds a show/hide ("eye") toggle to every password
 * input — login, reset and change password alike. Payload renders those
 * inputs itself, so the toggle is attached to them as they appear.
 */
export function PasswordRevealProvider({ children }: { children: ReactNode }) {
  useDomScan(scanPasswordInputs, { timing: 'frame' })

  return children
}
