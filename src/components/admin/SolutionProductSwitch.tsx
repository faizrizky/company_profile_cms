'use client'

import { useConfig, useFormFields } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAdminText } from './useAdminText'

const TEXT = {
  en: {
    label: 'Solution & Product',
    noProducts: 'This category has no products yet',
    noCategory: 'Choose a category first',
  },
  id: {
    label: 'Solution & Product',
    noProducts: 'Kategori ini belum punya produk',
    noCategory: 'Pilih kategori terlebih dahulu',
  },
}

type Side = 'solution' | 'product'

/**
 * "Solution | Product" in the lists and forms of Solution & Product: Solution
 * is the product cards (products), Product the category page (solution
 * categories). On a document it opens the other side of the same category:
 * a category's first product, a product's category.
 */
export function SolutionProductSwitch() {
  const { config } = useConfig()
  const t = useAdminText(TEXT)
  const pathname = usePathname()
  const admin = config.routes.admin
  const [, slug, rawId, view] = pathname.slice(admin.length).split('/').slice(1)
  const id = rawId && rawId !== 'create' ? rawId : undefined
  const current: Side = slug === 'products' ? 'solution' : 'product'
  const suffix = view === 'form' ? '/form' : ''

  // A product's category, as chosen in its form (only there: lists have no form).
  const category = useFormFields(([fields]) => fields?.category?.value) as
    | number
    | string
    | { id: number | string }
    | null
    | undefined
  const productCategory = typeof category === 'object' && category ? category.id : category

  // A category's first product (latest drafts included: new ones start as drafts).
  const [firstProduct, setFirstProduct] = useState<{ for: string; id: number | null } | null>(null)
  useEffect(() => {
    if (current !== 'product' || !id) return
    let active = true
    const query = `where[category][equals]=${encodeURIComponent(id)}&sort=_order&limit=1&depth=0&draft=true&select[id]=true`
    fetch(`${config.serverURL}${config.routes.api}/products?${query}`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => active && setFirstProduct({ for: id, id: res?.docs?.[0]?.id ?? null }))
      .catch(() => active && setFirstProduct({ for: id, id: null }))
    return () => {
      active = false
    }
  }, [current, id, config.serverURL, config.routes.api])

  const to = (path: string) => `${admin}${path}`
  const targets: Record<Side, { href: string | null; reason?: string }> = id
    ? current === 'product'
      ? {
          product: { href: to(`/collections/solution-categories/${id}${suffix}`) },
          solution: {
            href:
              firstProduct?.for === id && firstProduct.id != null
                ? to(`/collections/products/${firstProduct.id}${suffix}`)
                : null,
            reason: firstProduct?.for === id ? t.noProducts : undefined,
          },
        }
      : {
          solution: { href: to(`/collections/products/${id}${suffix}`) },
          product: {
            href: productCategory ? to(`/collections/solution-categories/${productCategory}${suffix}`) : null,
            reason: t.noCategory,
          },
        }
    : {
        solution: { href: to('/collections/products') },
        product: { href: to('/collections/solution-categories') },
      }

  return (
    <div className="falah-switch" role="group" aria-label={t.label}>
      {(['solution', 'product'] as const).map((side) => {
        const label = side === 'solution' ? 'Solution' : 'Product'
        const { href, reason } = targets[side]
        if (side === current) {
          return (
            <span key={side} className="falah-switch__option is-active" aria-current="page">
              {label}
            </span>
          )
        }
        return href ? (
          <Link key={side} className="falah-switch__option" href={href} prefetch={false}>
            {label}
          </Link>
        ) : (
          <span key={side} className="falah-switch__option is-disabled" aria-disabled title={reason}>
            {label}
          </span>
        )
      })}
    </div>
  )
}
