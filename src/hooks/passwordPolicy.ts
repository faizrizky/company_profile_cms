import { APIError, type CollectionBeforeValidateHook } from 'payload'

import { checkPasswordStrength } from '@/lib/passwordRules'

export { checkPasswordStrength }

export const enforcePasswordPolicy: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const password = data?.password
  if (typeof password !== 'string' || password.length === 0) return data

  const problem = checkPasswordStrength(password, data?.email ?? originalDoc?.email)
  if (problem) throw new APIError(problem, 400, undefined, true)
  return data
}
