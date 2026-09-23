import type { TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

/**
 * A custom `validate` replaces Payload's built-in one, which would silently
 * drop `required` / `maxLength`. Run the built-in check first, then ours.
 */
export const withTextValidation =
  (check: (value: string) => true | string): TextFieldSingleValidation =>
  (value, options) => {
    const base = text(value, options)
    if (base !== true) return base
    if (value === null || value === undefined || value === '') return true
    return check(value)
  }
