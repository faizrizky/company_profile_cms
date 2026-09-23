import { getTranslation } from '@payloadcms/translations'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import type { PayloadRequest, ServerProps, VisibleEntities } from 'payload'
import { formatAdminURL, PREFERENCE_KEYS } from 'payload/shared'

import { FalahNavClient, type NavGroupData } from './FalahNavClient'

type Props = ServerProps & { req?: PayloadRequest; visibleEntities?: VisibleEntities }

type NavPrefs = { groups?: Record<string, { open?: boolean }> } | undefined

async function getNavPrefs(req: PayloadRequest | undefined): Promise<NavPrefs> {
  if (!req?.user?.collection) return undefined
  const { docs } = await req.payload.find({
    collection: 'payload-preferences',
    depth: 0,
    limit: 1,
    pagination: false,
    req,
    where: {
      and: [
        { key: { equals: PREFERENCE_KEYS.NAV } },
        { 'user.relationTo': { equals: req.user.collection } },
        { 'user.value': { equals: req.user.id } },
      ],
    },
  })
  return docs[0]?.value as NavPrefs
}

/**
 * Replaces Payload's sidebar. Same permission-aware grouping as the default
 * nav, but it stays on screen as an icon rail when collapsed and carries the
 * account menu at the bottom.
 */
export async function FalahNav({ i18n, payload, permissions, req, visibleEntities }: Props) {
  if (!payload?.config || !permissions || !visibleEntities) return null
  const { collections, globals, routes } = payload.config

  const grouped = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities.collections.includes(slug))
        .map((entity) => ({ type: EntityType.collection, entity }) as const),
      ...globals
        .filter(({ slug }) => visibleEntities.globals.includes(slug))
        .map((entity) => ({ type: EntityType.global, entity }) as const),
    ],
    permissions,
    i18n,
  )
  const prefs = await getNavPrefs(req)

  const groups: NavGroupData[] = grouped.map(({ label, entities }) => ({
    label,
    open: prefs?.groups?.[label]?.open,
    items: entities.map(({ slug, type, label: entityLabel }) => {
      const isGlobal = type === EntityType.global
      return {
        id: isGlobal ? `nav-global-${slug}` : `nav-${slug}`,
        href: formatAdminURL({
          adminRoute: routes.admin,
          path: `/${isGlobal ? 'globals' : 'collections'}/${slug}`,
        }),
        label: getTranslation(entityLabel, i18n),
      }
    }),
  }))

  return <FalahNavClient groups={groups} />
}
