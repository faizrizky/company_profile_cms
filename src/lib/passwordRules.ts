/**
 * Password policy, shared by the server hook (enforcement) and the admin UI
 * (live checklist) so both always agree. Client-safe: no server imports.
 */

export const PASSWORD_MIN_LENGTH = 12

type Lang = 'en' | 'id'

export type PasswordRule = {
  id: 'length' | 'lower' | 'upper' | 'digit' | 'symbol' | 'email'
  test: (password: string, email?: string) => boolean
  /** Checklist wording. */
  label: Record<Lang, string>
  /** Error returned by the API when the rule fails. */
  error: string
}

function emailLocalPart(email?: string) {
  const local = email?.split('@')[0]?.toLowerCase()
  return local && local.length >= 3 ? local : undefined
}

export const passwordRules: PasswordRule[] = [
  {
    id: 'length',
    test: (p) => p.length >= PASSWORD_MIN_LENGTH,
    label: {
      en: `At least ${PASSWORD_MIN_LENGTH} characters`,
      id: `Minimal ${PASSWORD_MIN_LENGTH} karakter`,
    },
    error: `Password minimal ${PASSWORD_MIN_LENGTH} karakter.`,
  },
  {
    id: 'lower',
    test: (p) => /[a-z]/.test(p),
    label: { en: 'A lowercase letter', id: 'Huruf kecil' },
    error: 'Password harus mengandung huruf kecil.',
  },
  {
    id: 'upper',
    test: (p) => /[A-Z]/.test(p),
    label: { en: 'An uppercase letter', id: 'Huruf besar' },
    error: 'Password harus mengandung huruf besar.',
  },
  {
    id: 'digit',
    test: (p) => /\d/.test(p),
    label: { en: 'A number', id: 'Angka' },
    error: 'Password harus mengandung angka.',
  },
  {
    id: 'symbol',
    test: (p) => /[^A-Za-z0-9]/.test(p),
    label: { en: 'A symbol (e.g. ! @ # $)', id: 'Simbol (mis. ! @ # $)' },
    error: 'Password harus mengandung simbol.',
  },
  {
    id: 'email',
    test: (p, email) => {
      const local = emailLocalPart(email)
      return !local || !p.toLowerCase().includes(local)
    },
    label: { en: "Doesn't contain your email", id: 'Tidak mengandung email Anda' },
    error: 'Password tidak boleh mengandung email.',
  },
]

/** The API error for the first rule the password breaks, or null if it passes. */
export function checkPasswordStrength(password: string, email?: string): string | null {
  return passwordRules.find((rule) => !rule.test(password, email))?.error ?? null
}
