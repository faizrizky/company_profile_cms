'use client'

import { useFormFields, useTranslation } from '@payloadcms/ui'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { passwordRules } from '@/lib/passwordRules'

const PASSWORD_FIELD = '.auth-fields__changing-password .field-type.password'
const CONFIRM_FIELD = '.auth-fields__changing-password .field-type.confirm-password'

const text = {
  en: {
    incomplete: 'Please meet every requirement below to create a safe password.',
    match: 'Passwords match',
    mismatch: "Passwords don't match",
  },
  id: {
    incomplete: 'Lengkapi semua syarat di bawah agar password aman.',
    match: 'Password sudah sama',
    mismatch: 'Password belum sama',
  },
}

type State = 'valid' | 'invalid' | undefined

/** Colours the input border through a data attribute on Payload's field wrapper. */
function useFieldState(el: Element | null, state: State) {
  useEffect(() => {
    if (!el) return
    if (state) el.setAttribute('data-pw-state', state)
    else el.removeAttribute('data-pw-state')
    return () => el.removeAttribute('data-pw-state')
  }, [el, state])
}

/**
 * Password requirements shown under "New password" (and a match hint under
 * "Confirm password") on the user screens. Registered as a UI field on Users;
 * it renders into Payload's password inputs, which only exist while a
 * password is being set, through portals.
 */
export function PasswordChecklist() {
  const { i18n } = useTranslation()
  const password = useFormFields(([fields]) => fields.password?.value)
  const confirm = useFormFields(([fields]) => fields['confirm-password']?.value)
  const email = useFormFields(([fields]) => fields.email?.value)
  const [hosts, setHosts] = useState<{ password: Element | null; confirm: Element | null }>({
    password: null,
    confirm: null,
  })

  // The inputs appear when "Change password" is clicked (and are always there
  // when creating a user).
  useEffect(() => {
    const root = document.querySelector('.document-fields') ?? document.body
    const find = () => {
      const next = {
        password: document.querySelector(PASSWORD_FIELD),
        confirm: document.querySelector(CONFIRM_FIELD),
      }
      setHosts((prev) =>
        prev.password === next.password && prev.confirm === next.confirm ? prev : next,
      )
    }
    find()
    const observer = new MutationObserver(find)
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  const lang = i18n.language === 'id' ? 'id' : 'en'
  const value = typeof password === 'string' ? password : ''
  const confirmValue = typeof confirm === 'string' ? confirm : ''
  const started = value.length > 0
  const rules = passwordRules.map((rule) => ({
    id: rule.id,
    label: rule.label[lang],
    ok: rule.test(value, typeof email === 'string' ? email : undefined),
  }))
  const allOk = rules.every((rule) => rule.ok)
  const matches = confirmValue.length > 0 && confirmValue === value

  useFieldState(hosts.password, started ? (allOk ? 'valid' : 'invalid') : undefined)
  useFieldState(hosts.confirm, confirmValue ? (matches ? 'valid' : 'invalid') : undefined)

  return (
    <>
      {hosts.password
        ? createPortal(
            <div className="falah-pw" aria-live="polite">
              {started && !allOk ? (
                <p className="falah-pw__message">{text[lang].incomplete}</p>
              ) : null}
              <ul className="falah-pw__list">
                {rules.map((rule) => (
                  <li
                    key={rule.id}
                    className={`falah-pw__item${rule.ok && started ? ' is-ok' : ''}${!rule.ok && started ? ' is-missing' : ''}`}
                  >
                    {rule.label}
                    <span className="sr-only">{rule.ok ? ' ✓' : ' ✗'}</span>
                  </li>
                ))}
              </ul>
            </div>,
            hosts.password,
          )
        : null}
      {hosts.confirm && confirmValue
        ? createPortal(
            <p className={`falah-pw__match ${matches ? 'is-ok' : 'is-missing'}`} aria-live="polite">
              {matches ? text[lang].match : text[lang].mismatch}
            </p>,
            hosts.confirm,
          )
        : null}
    </>
  )
}
