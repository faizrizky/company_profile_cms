'use client'

import { FieldDescription, FieldError, FieldLabel, useConfig, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useEffect, useId, useMemo, useState, type CSSProperties } from 'react'

import { useAdminText } from './useAdminText'

type Option = { label: string; href: string }
type Group = { label: string; options: Option[] }

const CUSTOM = '__custom__'

const TEXT = {
  en: { pages: 'Pages', solutions: 'Solutions', custom: 'Other (own URL)…', placeholder: 'e.g. /contact, #faq, https://…', empty: '— Choose a page —' },
  id: { pages: 'Halaman', solutions: 'Solusi', custom: 'Lainnya (URL sendiri)…', placeholder: 'mis. /contact, #faq, https://…', empty: '— Pilih halaman —' },
}

/** Loaded once per admin session and shared by every link field. */
let cache: Promise<Group[]> | null = null

function loadGroups(api: string, t: (typeof TEXT)['en']): Promise<Group[]> {
  cache ??= (async () => {
    const get = (path: string) =>
      fetch(`${api}${path}`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null))
    const [pages, categories, navigation] = await Promise.all([
      get('/pages?limit=100&depth=0&sort=title&select[title]=true&select[slug]=true'),
      get('/solution-categories?limit=100&depth=0&sort=_order&where[hasDetailPage][equals]=true&select[title]=true&select[slug]=true'),
      get('/globals/navigation?depth=0'),
    ])
    const groups: Group[] = [
      {
        label: t.pages,
        options: (pages?.docs ?? []).map((p: { title: string; slug: string }) => ({
          label: p.title,
          href: p.slug === 'home' ? '/' : `/${p.slug}`,
        })),
      },
      {
        label: t.solutions,
        options: (categories?.docs ?? []).map((c: { title: string; slug: string }) => ({
          label: c.title,
          href: `/solution/${c.slug}`,
        })),
      },
      // "Links per page" from Settings → Navigation.
      ...((navigation?.linkLibrary ?? []) as { group?: string; links?: { label?: string; target?: string }[] }[]).map(
        (g) => ({
          label: g.group || '—',
          options: (g.links ?? [])
            .filter((l) => l.target)
            .map((l) => ({ label: l.label || l.target!, href: l.target! })),
        }),
      ),
    ]
    return groups.filter((g) => g.options.length)
  })().catch(() => {
    cache = null
    return []
  })
  return cache
}

/**
 * Link fields as a grouped dropdown (pages, solution pages, the Navigation
 * link library) with a free-text fallback, so editors pick instead of typing.
 */
export const LinkField: TextFieldClientComponent = ({ field, path: pathFromProps }) => {
  const path = pathFromProps ?? field.name
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const { config } = useConfig()
  const t = useAdminText(TEXT)
  const id = useId()
  const [groups, setGroups] = useState<Group[]>([])
  const [custom, setCustom] = useState(false)

  useEffect(() => {
    let active = true
    void loadGroups(`${config.serverURL}${config.routes.api}`, t).then((g) => active && setGroups(g))
    return () => {
      active = false
    }
  }, [config.serverURL, config.routes.api, t])

  const known = useMemo(() => new Set(groups.flatMap((g) => g.options.map((o) => o.href))), [groups])
  const isCustom = custom || (!!value && groups.length > 0 && !known.has(value))
  const selectValue = isCustom ? CUSTOM : (value ?? '')

  return (
    <div
      className={`field-type text falah-link-field${showError ? ' error' : ''}`}
      // Same width rules as Payload's own fields (rows share space evenly).
      style={
        (field.admin?.width
          ? { '--field-width': field.admin.width }
          : { flex: '1 1 0', minWidth: 0 }) as CSSProperties
      }
    >
      <FieldLabel htmlFor={id} label={field.label} required={field.required} />
      <div className="field-type__wrap">
        <FieldError path={path} message={errorMessage} showError={showError} />
        <select
          id={id}
          className="falah-link-field__select"
          value={selectValue}
          disabled={field.admin?.readOnly}
          onChange={(e) => {
            if (e.target.value === CUSTOM) {
              setCustom(true)
              return
            }
            setCustom(false)
            setValue(e.target.value)
          }}
        >
          <option value="">{t.empty}</option>
          {groups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={`${g.label}-${o.href}`} value={o.href}>
                  {o.label} ({o.href})
                </option>
              ))}
            </optgroup>
          ))}
          <option value={CUSTOM}>{t.custom}</option>
        </select>
        {isCustom ? (
          <input
            type="text"
            className="falah-link-field__input"
            value={value ?? ''}
            placeholder={t.placeholder}
            onChange={(e) => setValue(e.target.value)}
            aria-label={t.custom}
          />
        ) : null}
      </div>
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
