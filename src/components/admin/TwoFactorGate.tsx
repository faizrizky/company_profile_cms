'use client'

import { useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

type Status = { enabled: boolean; verified: boolean; recoveryCodesLeft: number; lockedFor: number }
type Step = 'verify' | 'intro' | 'scan' | 'recovery'

/** Event other admin components dispatch to set 2FA up again (new phone). */
export const TWO_FACTOR_SETUP_EVENT = 'falah-2fa-setup'

const TEXT = {
  en: {
    title: 'Two-step verification',
    verifyLead: 'Enter the 6-digit code from your authenticator app.',
    recoveryLead: 'Enter one of your recovery codes. Each code works once.',
    useRecovery: 'Use a recovery code',
    useApp: 'Use the authenticator app',
    verify: 'Verify',
    introLead:
      'For your account’s safety, every CMS user signs in with a password and a code from an authenticator app (Google Authenticator, Microsoft Authenticator, 1Password…).',
    start: 'Set up',
    scanLead: 'Scan this QR code with your authenticator app, then enter the 6-digit code it shows.',
    manual: 'Can’t scan? Enter this key manually:',
    copy: 'Copy',
    copied: 'Copied',
    activate: 'Activate',
    recoveryTitle: 'Save your recovery codes',
    recoveryText:
      'If you lose your phone, each of these codes signs you in once. Store them somewhere safe (a password manager) — they are shown only now.',
    download: 'Download .txt',
    saved: 'I have saved my recovery codes',
    done: 'Continue',
    logout: 'Log out',
    invalid: 'The code is incorrect or expired. Try again.',
    locked: (s: number) => `Too many wrong codes. Try again in ${Math.ceil(s / 60)} min.`,
    failed: 'Something went wrong. Please try again.',
    codeLabel: 'Code',
  },
  id: {
    title: 'Verifikasi dua langkah',
    verifyLead: 'Masukkan 6 digit kode dari aplikasi authenticator Anda.',
    recoveryLead: 'Masukkan salah satu recovery code. Tiap kode hanya bisa dipakai sekali.',
    useRecovery: 'Pakai recovery code',
    useApp: 'Pakai aplikasi authenticator',
    verify: 'Verifikasi',
    introLead:
      'Demi keamanan akun, setiap user CMS masuk dengan password dan kode dari aplikasi authenticator (Google Authenticator, Microsoft Authenticator, 1Password…).',
    start: 'Atur sekarang',
    scanLead: 'Scan QR code ini dengan aplikasi authenticator, lalu masukkan 6 digit kode yang muncul.',
    manual: 'Tidak bisa scan? Masukkan kunci ini secara manual:',
    copy: 'Salin',
    copied: 'Tersalin',
    activate: 'Aktifkan',
    recoveryTitle: 'Simpan recovery code Anda',
    recoveryText:
      'Kalau HP hilang, tiap kode ini bisa dipakai masuk satu kali. Simpan di tempat aman (password manager) — kode hanya ditampilkan sekarang.',
    download: 'Unduh .txt',
    saved: 'Saya sudah menyimpan recovery code',
    done: 'Lanjut',
    logout: 'Keluar',
    invalid: 'Kode salah atau sudah kedaluwarsa. Coba lagi.',
    locked: (s: number) => `Terlalu banyak kode salah. Coba lagi dalam ${Math.ceil(s / 60)} menit.`,
    failed: 'Terjadi kesalahan. Silakan coba lagi.',
    codeLabel: 'Kode',
  },
}

/**
 * Admin-wide provider: after the password, every session must pass the
 * authenticator step (or set it up once). The API refuses everything until
 * then (see `@/access`); this dialog is the way through.
 */
export function TwoFactorGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { config } = useConfig()
  const { i18n } = useTranslation()
  const t = i18n.language === 'id' ? TEXT.id : TEXT.en
  const api = `${config.serverURL}${config.routes.api}/users/2fa`

  // Keyed by user: a status fetched for someone else (after logout/login) is ignored.
  const [fetched, setFetched] = useState<{ userId: unknown; status: Status | null } | null>(null)
  const [forcedSetup, setForcedSetup] = useState(false)
  const userId = user?.id
  const status = user && fetched && fetched.userId === userId ? fetched.status : null

  useEffect(() => {
    if (!userId) return
    let active = true
    fetch(`${api}/status`, { credentials: 'include', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((s: Status | null) => active && setFetched({ userId, status: s }))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [api, userId])

  useEffect(() => {
    const open = () => setForcedSetup(true)
    window.addEventListener(TWO_FACTOR_SETUP_EVENT, open)
    return () => window.removeEventListener(TWO_FACTOR_SETUP_EVENT, open)
  }, [])

  const open = Boolean(user && status && (!status.verified || forcedSetup))

  return (
    <>
      {children}
      {open && status && (
        <TwoFactorDialog
          api={api}
          status={status}
          startInSetup={forcedSetup}
          t={t}
          logoutHref={`${config.routes.admin}/logout`}
          onCancel={forcedSetup && status.verified ? () => setForcedSetup(false) : undefined}
        />
      )}
    </>
  )
}

function TwoFactorDialog({
  api,
  status,
  startInSetup,
  t,
  logoutHref,
  onCancel,
}: {
  api: string
  status: Status
  startInSetup: boolean
  t: (typeof TEXT)['en']
  logoutHref: string
  onCancel?: () => void
}) {
  const [step, setStep] = useState<Step>(status.enabled && !startInSetup ? 'verify' : 'intro')
  const [useRecovery, setUseRecovery] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(status.lockedFor ? t.locked(status.lockedFor) : null)
  const [busy, setBusy] = useState(false)
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null)
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [step, useRecovery])

  const post = useCallback(
    async (path: string, body?: unknown) => {
      const res = await fetch(`${api}/${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ?? {}),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error === 'locked' ? t.locked(data.retryAfter ?? 900) : data.error === 'invalid' ? t.invalid : t.failed)
        return null
      }
      setError(null)
      return data
    },
    [api, t],
  )

  const run = async (task: () => Promise<void>) => {
    setBusy(true)
    try {
      await task()
    } finally {
      setBusy(false)
    }
  }

  const startSetup = () =>
    run(async () => {
      const data = await post('setup')
      if (data) {
        setSetup(data)
        setStep('scan')
      }
    })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    run(async () => {
      if (step === 'scan') {
        const data = await post('enable', { code })
        if (data) {
          setRecoveryCodes(data.recoveryCodes)
          setStep('recovery')
        }
      } else {
        const data = await post('verify', useRecovery ? { recoveryCode: code } : { code })
        if (data) window.location.reload()
      }
      setCode('')
    })
  }

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value).catch(() => {})
    setCopied(value)
    window.setTimeout(() => setCopied(null), 1500)
  }

  const download = () => {
    const blob = new Blob([`Falah CMS — recovery codes\n\n${recoveryCodes.join('\n')}\n`], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'falah-cms-recovery-codes.txt'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const codeForm = (label: string) => (
    <form className="falah-2fa__form" onSubmit={submit}>
      <label className="falah-2fa__label" htmlFor="falah-2fa-code">
        {t.codeLabel}
      </label>
      <input
        ref={inputRef}
        id="falah-2fa-code"
        className="falah-2fa__input"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        inputMode={useRecovery ? 'text' : 'numeric'}
        autoComplete="one-time-code"
        maxLength={useRecovery ? 12 : 6}
        placeholder={useRecovery ? 'XXXX-XXXX' : '000000'}
        aria-invalid={Boolean(error)}
      />
      {error && (
        <p className="falah-2fa__error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="falah-2fa__primary" disabled={busy || code.trim().length < 6}>
        {label}
      </button>
    </form>
  )

  return (
    <div className="falah-2fa" role="dialog" aria-modal="true" aria-labelledby="falah-2fa-title">
      <div className="falah-2fa__card">
        <div className="falah-2fa__icon" aria-hidden>
          🔐
        </div>
        <h2 id="falah-2fa-title" className="falah-2fa__title">
          {step === 'recovery' ? t.recoveryTitle : t.title}
        </h2>

        {step === 'verify' && (
          <>
            <p className="falah-2fa__lead">{useRecovery ? t.recoveryLead : t.verifyLead}</p>
            {codeForm(t.verify)}
            <button
              type="button"
              className="falah-2fa__link"
              onClick={() => {
                setUseRecovery((v) => !v)
                setCode('')
                setError(null)
              }}
            >
              {useRecovery ? t.useApp : t.useRecovery}
            </button>
          </>
        )}

        {step === 'intro' && (
          <>
            <p className="falah-2fa__lead">{t.introLead}</p>
            {error && (
              <p className="falah-2fa__error" role="alert">
                {error}
              </p>
            )}
            <button type="button" className="falah-2fa__primary" onClick={startSetup} disabled={busy}>
              {t.start}
            </button>
          </>
        )}

        {step === 'scan' && setup && (
          <>
            <p className="falah-2fa__lead">{t.scanLead}</p>
            {/* SVG generated by our own endpoint (qrcode library), not user content. */}
            <div className="falah-2fa__qr" dangerouslySetInnerHTML={{ __html: setup.qr }} />
            <p className="falah-2fa__hint">{t.manual}</p>
            <div className="falah-2fa__secret">
              <code>{setup.secret.match(/.{1,4}/g)?.join(' ')}</code>
              <button type="button" className="falah-2fa__link" onClick={() => copy(setup.secret)}>
                {copied === setup.secret ? t.copied : t.copy}
              </button>
            </div>
            {codeForm(t.activate)}
          </>
        )}

        {step === 'recovery' && (
          <>
            <p className="falah-2fa__lead">{t.recoveryText}</p>
            <ol className="falah-2fa__codes">
              {recoveryCodes.map((c) => (
                <li key={c}>
                  <code>{c}</code>
                </li>
              ))}
            </ol>
            <div className="falah-2fa__row">
              <button type="button" className="falah-2fa__secondary" onClick={() => copy(recoveryCodes.join('\n'))}>
                {copied === recoveryCodes.join('\n') ? t.copied : t.copy}
              </button>
              <button type="button" className="falah-2fa__secondary" onClick={download}>
                {t.download}
              </button>
            </div>
            <label className="falah-2fa__check">
              <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
              {t.saved}
            </label>
            <button
              type="button"
              className="falah-2fa__primary"
              disabled={!saved}
              onClick={() => window.location.reload()}
            >
              {t.done}
            </button>
          </>
        )}

        {step !== 'recovery' &&
          (onCancel ? (
            <button type="button" className="falah-2fa__link falah-2fa__logout" onClick={onCancel}>
              ×
            </button>
          ) : (
            <a className="falah-2fa__link falah-2fa__logout" href={logoutHref}>
              {t.logout}
            </a>
          ))}
      </div>
    </div>
  )
}
