import type { TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

/**
 * A custom `validate` replaces Payload's built-in one, which would silently
 * drop `required` / `maxLength`. Run the built-in check first, then ours.
 */
export const withTextValidation =
  (check: (value: string, lang: string) => true | string): TextFieldSingleValidation =>
  (value, options) => {
    const base = text(value, options)
    if (base !== true) return base
    if (value === null || value === undefined || value === '') return true
    // `lang` is the admin interface language, for bilingual messages.
    return check(value, options.req?.i18n?.language ?? 'en')
  }
