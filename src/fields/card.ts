import type { CollapsibleField, Field } from 'payload'

type Label = { en: string; id: string }

/**
 * A titled card that groups related fields on the edit screen. Purely
 * presentational (a Payload `collapsible`): it doesn't nest the data, so the
 * API, database and frontend types are unchanged.
 */
export const fieldCard = (label: Label, fields: Field[]): CollapsibleField => ({
  type: 'collapsible',
  label,
  admin: { initCollapsed: false },
  fields,
})
