'use client'

import {
  FieldDescription,
  FieldLabel,
  useConfig,
  useDocumentInfo,
  useField,
  useFormFields,
  useLocale,
} from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { useEffect, useId, useState, type CSSProperties } from 'react'

import { useAdminText } from './useAdminText'

type Tab = { id: string; name: string; usedBy?: string }

const TEXT = {
  en: {
    auto: '— Automatic (tab named like the product) —',
    none: 'Choose a category first',
    noPage: 'This category has no detail page, so the card is not a link.',
    usedBy: (title: string) => `used by "${title}"`,
  },
  id: {
    auto: '— Otomatis (tab yang namanya sama dengan produk) —',
    none: 'Pilih kategori terlebih dahulu',
    noPage: 'Kategori ini tidak punya halaman detail, jadi kartu tidak bisa diklik.',
    usedBy: (title: string) => `dipakai "${title}"`,
  },
}

/**
 * Which Showcase tab of the product's category the card opens: a dropdown
 * of that category's tabs. Stores the tab's row id, so renaming a tab keeps
 * the link.
 */
export const ShowcaseTabField: TextFieldClientComponent = ({ field, path: pathFromProps }) => {
  const path = pathFromProps ?? field.name
  const { value, setValue } = useField<string>({ path })
  const category = useFormFields(([fields]) => fields.category?.value) as
    number | string | { id: number | string } | null | undefined
  const categoryId = typeof category === 'object' && category ? category.id : category
  const { config } = useConfig()
  const { id: productId } = useDocumentInfo()
  const locale = useLocale()
  const t = useAdminText(TEXT)
  const id = useId()
  const [loaded, setLoaded] = useState<{ for: unknown; tabs: Tab[]; hasPage: boolean } | null>(null)
  // Tabs of the currently chosen category (stale results are ignored).
  const state = categoryId && loaded?.for === categoryId ? loaded : null

  useEffect(() => {
    if (!categoryId) return
    let active = true
    const api = `${config.serverURL}${config.routes.api}`
    const json = (url: string) =>
      fetch(url, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null))
    Promise.all([
      json(
        `${api}/solution-categories/${categoryId}?depth=0&draft=true&locale=${locale.code}&select[hasDetailPage]=true&select[showcase][tabs]=true`,
      ),
      // The category's products, to mark the tabs other products already open (one product per tab).
      json(
        `${api}/products?where[category][equals]=${categoryId}&depth=0&draft=true&limit=100&locale=${locale.code}&select[title]=true&select[showcaseTab]=true`,
      ),
    ])
      .then(([doc, products]) => {
        if (!active) return
        const others = ((products?.docs ?? []) as { id: number; title?: string; showcaseTab?: string }[]).filter(
          (product) => String(product.id) !== String(productId),
        )
        setLoaded({
          for: categoryId,
          tabs: (doc?.showcase?.tabs ?? []).map((tab: Tab) => ({
            id: tab.id,
            name: tab.name,
            usedBy: others.find((product) => product.showcaseTab === tab.id)?.title,
          })),
          hasPage: doc?.hasDetailPage !== false,
        })
      })
      .catch(() => active && setLoaded({ for: categoryId, tabs: [], hasPage: true }))
    return () => {
      active = false
    }
  }, [categoryId, config.serverURL, config.routes.api, locale.code, productId])

  return (
    <div
      className="field-type text falah-link-field"
      style={{ flex: '1 1 0', minWidth: 0 } as CSSProperties}
    >
      <FieldLabel htmlFor={id} label={field.label} />
      <div className="field-type__wrap">
        <select
          id={id}
          className="falah-link-field__select"
          value={value ?? ''}
          disabled={!categoryId || field.admin?.readOnly}
          onChange={(e) => setValue(e.target.value || null)}
        >
          <option value="">{categoryId ? t.auto : t.none}</option>
          {state?.tabs.map((tab) => (
            // A tab another product opens can't be picked (one product per tab).
            <option key={tab.id} value={tab.id} disabled={Boolean(tab.usedBy) && tab.id !== value}>
              {tab.usedBy ? `${tab.name} — ${t.usedBy(tab.usedBy)}` : tab.name}
            </option>
          ))}
        </select>
      </div>
      {state && !state.hasPage ? (
        <div className="field-description">{t.noPage}</div>
      ) : (
        <FieldDescription description={field.admin?.description} path={path} />
      )}
    </div>
  )
}
