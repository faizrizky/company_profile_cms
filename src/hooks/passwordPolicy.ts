import { APIError, type CollectionBeforeValidateHook } from 'payload'

const MIN_LENGTH = 12

export function checkPasswordStrength(password: string, email?: string): string | null {
  if (password.length < MIN_LENGTH) return `Password minimal ${MIN_LENGTH} karakter.`
  if (!/[a-z]/.test(password)) return 'Password harus mengandung huruf kecil.'
  if (!/[A-Z]/.test(password)) return 'Password harus mengandung huruf besar.'
  if (!/\d/.test(password)) return 'Password harus mengandung angka.'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password harus mengandung simbol.'

  const localPart = email?.split('@')[0]?.toLowerCase()
  if (localPart && localPart.length >= 3 && password.toLowerCase().includes(localPart)) {
    return 'Password tidak boleh mengandung email.'
  }
  return null
}

export const enforcePasswordPolicy: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const password = data?.password
  if (typeof password !== 'string' || password.length === 0) return data

  const problem = checkPasswordStrength(password, data?.email ?? originalDoc?.email)
  if (problem) throw new APIError(problem, 400, undefined, true)
  return data
}
