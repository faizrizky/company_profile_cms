import type { Block, CollectionConfig, Field, GlobalConfig } from 'payload'
import { formatLabels, toWords } from 'payload/shared'

import { fieldCard } from '../fields/card'

import {
  BLOCKS_ID,
  DESCRIPTIONS_EN,
  ENTITIES_ID,
  LABELS_EN,
  LABELS_ID,
  OPTIONS_EN,
  OPTIONS_ID,
} from './adminText'

type Text = string | Record<string, string>

/** A plain label becomes { en, id }; already-bilingual labels are kept. */
const bilingual = (text: unknown, id: Record<string, string>, en: Record<string, string> = {}): unknown => {
  if (typeof text !== 'string') return text
  if (en[text]) return { en: en[text], id: text }
  return { en: text, id: id[text] ?? text }
}

/** Only descriptions we have an English version of; the rest stay as written. */
const description = (text: unknown): unknown =>
  typeof text === 'string' && DESCRIPTIONS_EN[text] ? { en: DESCRIPTIONS_EN[text], id: text } : text

const label = (text: unknown) => bilingual(text, LABELS_ID, LABELS_EN)

const isMediaField = (f: Field): boolean =>
  f.type === 'upload' || (f.type === 'row' && f.fields.length > 0 && f.fields.every((x) => x.type === 'upload'))

type Kind = 'media' | 'content' | 'keep'

const isHidden = (f: Field) => {
  const admin = (f as { admin?: { hidden?: boolean; position?: string } }).admin
  return Boolean(admin?.hidden || admin?.position === 'sidebar')
}

/** Containers already are cards/sections; loose inputs get grouped. */
function kindOf(f: Field): Kind {
  if (isHidden(f)) return 'keep'
  if (isMediaField(f)) return 'media'
  switch (f.type) {
    case 'group':
    case 'array':
    case 'blocks':
    case 'collapsible':
    case 'tabs':
    case 'ui':
    case 'join':
      return 'keep'
    default:
      return 'content'
  }
}

const CARD_LABEL: Record<Exclude<Kind, 'keep'>, { en: string; id: string }> = {
  media: { en: 'Media', id: 'Media' },
  content: { en: 'Content', id: 'Konten' },
}

/**
 * Loose fields become cards, like the groups (Header): consecutive inputs
 * share a "Content" card, consecutive images/videos a "Media" card.
 * Presentational only (collapsibles): the data shape doesn't change.
 */
function groupIntoCards(fields: Field[]): Field[] {
  const out: Field[] = []
  let run: Field[] = []
  let runKind: Kind = 'keep'
  const flush = () => {
    if (run.length && runKind !== 'keep') out.push(fieldCard(CARD_LABEL[runKind], run))
    run = []
  }
  for (const field of fields) {
    const kind = kindOf(field)
    if (kind === 'keep') {
      flush()
      out.push(field)
      runKind = 'keep'
      continue
    }
    if (kind !== runKind) flush()
    runKind = kind
    run.push(field)
  }
  flush()
  return out
}

function translateFields(fields: Field[]): Field[] {
  return fields.map((field) => {
    const f = { ...field } as Field & Record<string, unknown>
    const admin = f.admin as Record<string, unknown> | undefined

    // Fields without a label get Payload's generated one, made bilingual.
    if ('name' in f && typeof f.name === 'string' && f.label === undefined && f.type !== 'ui') {
      f.label = toWords(f.name)
    }
    if (f.label !== false) (f as Record<string, unknown>).label = label(f.label)
    if (admin) (f as Record<string, unknown>).admin = { ...admin, description: description(admin.description) }

    if ('options' in f && Array.isArray(f.options)) {
      f.options = f.options.map((o) =>
        typeof o === 'object' ? { ...o, label: bilingual(o.label, OPTIONS_ID, OPTIONS_EN) as Text } : o,
      ) as typeof f.options
    }
    if ('fields' in f && Array.isArray(f.fields)) f.fields = translateFields(f.fields)
    if (f.type === 'tabs') {
      f.tabs = f.tabs.map((tab) => ({
        ...tab,
        label: label(tab.label) as Text,
        description: description(tab.description) as Text,
        fields: groupIntoCards(translateFields(tab.fields)),
      })) as typeof f.tabs
    }
    if (f.type === 'blocks') {
      f.blocks = (f.blocks as Block[]).map((block) => {
        const labels = block.labels ?? formatLabels(block.slug)
        return {
          ...block,
          labels: {
            singular: bilingual(labels.singular, BLOCKS_ID) as Text,
            plural: bilingual(labels.plural, BLOCKS_ID) as Text,
          },
          fields: groupIntoCards(translateFields(block.fields)),
        }
      })
    }
    return f as Field
  })
}

const adminText = <T extends { admin?: Record<string, unknown> }>(admin: T['admin']) =>
  admin && {
    ...admin,
    group: bilingual(admin.group, ENTITIES_ID),
    description: description(admin.description),
  }

/** Every label and description in a collection follows the admin language (EN / ID). */
export function translateCollection(collection: CollectionConfig): CollectionConfig {
  const labels = collection.labels ?? formatLabels(collection.slug)
  return {
    ...collection,
    labels: {
      singular: bilingual(labels.singular, ENTITIES_ID) as Text,
      plural: bilingual(labels.plural, ENTITIES_ID) as Text,
    },
    admin: adminText(collection.admin as Record<string, unknown>) as CollectionConfig['admin'],
    fields: translateFields(collection.fields),
  }
}

export function translateGlobal(global: GlobalConfig): GlobalConfig {
  return {
    ...global,
    label: bilingual(global.label ?? toWords(global.slug), ENTITIES_ID) as Text,
    admin: adminText(global.admin as Record<string, unknown>) as GlobalConfig['admin'],
    fields: groupIntoCards(translateFields(global.fields)),
  }
}
