/**
 * One-time migration of the hard-coded frontend content into the CMS.
 *
 *   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='…' npm run seed
 *
 * - Refuses to run twice (aborts if any page already exists).
 * - Uploads every asset through the Media collection, so each file goes
 *   through the same validation/sanitization as an editor upload.
 * - Writes English (default locale) first, then the Indonesian translation
 *   of every document from `translations.id.ts`.
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'
import {
  type CollectionSlug,
  type GlobalSlug,
  getPayload,
  type RequestContext,
  type RequiredDataFromCollectionSlug,
} from 'payload'

import { checkPasswordStrength } from '@/hooks/passwordPolicy'
import {
  aboutLayout,
  aboutPartnerRows,
  categories,
  certifications,
  contactLayout,
  footer,
  homeLayout,
  type MediaRef,
  navigation,
  partners,
  products,
  siteSettings,
  solutionLayout,
  virtualTrainingSuiteDetail,
} from './content'
import { translateToId, translationsId } from './translations.id'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(
  process.env.SEED_ASSETS_DIR ?? path.resolve(dirname, '../../../company-profile-falah/public'),
)

// Seeding is bulk data entry: skip per-document audit rows and frontend cache pings.
const context: RequestContext = { disableRevalidate: true, disableAudit: true }

async function main() {
  const payload = await getPayload({ config })
  const log = payload.logger

  /** Re-saves a document's English copy, translated, as its Indonesian version. */
  const addIndonesian = async (collection: CollectionSlug, id: number) => {
    const doc = await payload.findByID({
      collection,
      id,
      depth: 0,
      locale: 'en',
      overrideAccess: true,
    })
    const {
      id: _id,
      createdAt: _c,
      updatedAt: _u,
      _order: _o,
      ...data
    } = doc as unknown as Record<string, unknown>
    await payload.update({
      collection,
      id,
      locale: 'id',
      overrideAccess: true,
      context,
      data: translateToId(data),
    })
  }
  const addIndonesianGlobal = async (slug: GlobalSlug) => {
    const doc = await payload.findGlobal({ slug, depth: 0, locale: 'en', overrideAccess: true })
    const {
      id: _id,
      createdAt: _c,
      updatedAt: _u,
      globalType: _g,
      ...data
    } = doc as unknown as Record<string, unknown>
    await payload.updateGlobal({
      slug,
      locale: 'id',
      overrideAccess: true,
      context,
      data: translateToId(data),
    })
  }

  const existing = await payload.count({ collection: 'pages', overrideAccess: true })
  if (existing.totalDocs > 0) {
    log.warn('Pages already exist — seed skipped. Use the admin panel to edit content.')
    return
  }
  if (!existsSync(ASSETS_DIR)) {
    throw new Error(`Assets folder not found: ${ASSETS_DIR} (set SEED_ASSETS_DIR)`)
  }

  // ── Admin account ───────────────────────────────────────────────────
  const users = await payload.count({ collection: 'users', overrideAccess: true })
  if (users.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!email || !password)
      throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create the first admin.')
    const weak = checkPasswordStrength(password, email)
    if (weak) throw new Error(`SEED_ADMIN_PASSWORD rejected: ${weak}`)

    await payload.create({
      collection: 'users',
      overrideAccess: true,
      context,
      data: { email, password, name: 'Administrator', roles: ['admin'] },
    })
    log.info(`Admin user created: ${email}`)
  }

  // ── Media ───────────────────────────────────────────────────────────
  const mediaCache = new Map<string, Promise<number>>()
  const media: MediaRef = (assetPath, alt) => {
    const cached = mediaCache.get(assetPath)
    if (cached) return cached

    const upload = payload
      .create({
        collection: 'media',
        overrideAccess: true,
        context,
        data: { alt: alt ?? '' },
        filePath: path.join(ASSETS_DIR, assetPath),
      })
      .then(async (doc) => {
        const altId = alt && translationsId[alt]
        if (altId) {
          await payload.update({
            collection: 'media',
            id: doc.id,
            locale: 'id',
            overrideAccess: true,
            context,
            data: { alt: altId },
          })
        }
        return doc.id
      })
    mediaCache.set(assetPath, upload)
    return upload
  }

  // ── Collections ─────────────────────────────────────────────────────
  const partnerIds = new Map<string, number>()
  for (const { key, name, logo, showInHero } of partners) {
    const doc = await payload.create({
      collection: 'partners',
      overrideAccess: true,
      context,
      data: { name, showInHero, logo: await media(logo, name) },
    })
    partnerIds.set(key, doc.id)
  }
  log.info(`Partners: ${partnerIds.size}`)

  const certificationIds: number[] = []
  for (const cert of certifications) {
    const doc = await payload.create({
      collection: 'certifications',
      overrideAccess: true,
      context,
      data: {
        ...cert,
        icon: await media(cert.icon),
        certificate: await media(cert.certificate, cert.title),
      },
    })
    certificationIds.push(doc.id)
    await addIndonesian('certifications', doc.id)
  }
  log.info(`Certifications: ${certificationIds.length}`)

  const categoryIds = new Map<string, number>()
  for (const category of categories) {
    const detail =
      category.slug === 'virtual-training-suite'
        ? await virtualTrainingSuiteDetail(media)()
        : { hero: {}, challenges: {}, showcase: {}, cta: { buttonHref: '/contact' } }
    const data: RequiredDataFromCollectionSlug<'solution-categories'> = {
      ...category,
      ...detail,
      _status: 'published',
    }
    const doc = await payload.create({
      collection: 'solution-categories',
      overrideAccess: true,
      context,
      data,
    })
    categoryIds.set(category.slug, doc.id)
    await addIndonesian('solution-categories', doc.id)
  }
  log.info(`Solution categories: ${categoryIds.size}`)

  for (const product of products) {
    const doc = await payload.create({
      collection: 'products',
      overrideAccess: true,
      context,
      data: {
        slug: product.slug,
        title: product.title,
        summary: product.summary,
        category: categoryIds.get('virtual-training-suite')!,
        image: await media(product.image, product.title),
        imageMobile:
          'imageMobile' in product ? await media(product.imageMobile, product.title) : undefined,
        layout: 'layout' in product ? product.layout : undefined,
      },
    })
    await addIndonesian('products', doc.id)
  }
  log.info(`Products: ${products.length}`)

  // ── Pages ───────────────────────────────────────────────────────────
  const toIds = (keys: string[]) => keys.map((k) => partnerIds.get(k)!)
  const pages = [
    { slug: 'home', title: 'Home', layout: await homeLayout(media, certificationIds) },
    {
      slug: 'about',
      title: 'About',
      layout: await aboutLayout(media, certificationIds, {
        rowOne: toIds(aboutPartnerRows.rowOne),
        rowTwo: toIds(aboutPartnerRows.rowTwo),
      }),
    },
    { slug: 'solution', title: 'Solution', layout: await solutionLayout(media) },
    { slug: 'contact', title: 'Contact', layout: await contactLayout(media) },
  ]
  for (const page of pages) {
    const doc = await payload.create({
      collection: 'pages',
      overrideAccess: true,
      context,
      data: { ...page, _status: 'published' },
    })
    await addIndonesian('pages', doc.id)
  }
  log.info(`Pages: ${pages.map((p) => p.slug).join(', ')}`)

  // ── Globals ─────────────────────────────────────────────────────────
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    context,
    data: await siteSettings(media),
  })
  await payload.updateGlobal({
    slug: 'navigation',
    overrideAccess: true,
    context,
    data: await navigation(media),
  })
  await payload.updateGlobal({ slug: 'footer', overrideAccess: true, context, data: footer })
  for (const slug of ['site-settings', 'navigation', 'footer'] as const)
    await addIndonesianGlobal(slug)

  log.info(`Seed complete. Media uploaded: ${mediaCache.size}`)
}

try {
  await main()
  process.exit(0)
} catch (error) {
  console.error(error)
  process.exit(1)
}
