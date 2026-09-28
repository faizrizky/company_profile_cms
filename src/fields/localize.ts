import type { Block, Field } from 'payload'

/** Fields that are identifiers or addresses, not copy: identical in every language. */
const NOT_TRANSLATABLE = new Set([
  'slug',
  'href',
  'url',
  'videoUrl',
  'buttonHref',
  'email',
  'phone',
  'whatsappNumber',
  // Upload collections' own file name (Media overrides its list cell).
  'filename',
])

/**
 * Marks every text/textarea field (at any depth) as localized, so editors can
 * translate all copy without the schema having to repeat `localized: true`
 * on ~150 fields. Structure (block order, images, links) stays shared across
 * languages; only the words change.
 */
export function localizeTextFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        if ('name' in field && NOT_TRANSLATABLE.has(field.name)) return field
        if (field.localized === false) return field // explicitly shared
        return { ...field, localized: true } as Field
      case 'group':
      case 'array':
      case 'row':
      case 'collapsible':
        return { ...field, fields: localizeTextFields(field.fields) } as Field
      case 'tabs':
        return {
          ...field,
          tabs: field.tabs.map((tab) => ({ ...tab, fields: localizeTextFields(tab.fields) })),
        }
      case 'blocks':
        return {
          ...field,
          blocks: (field.blocks as Block[]).map((block) => ({
            ...block,
            fields: localizeTextFields(block.fields),
          })),
        }
      default:
        return field
    }
  })
}
