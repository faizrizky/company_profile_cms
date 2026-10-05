'use server'

import config from '@payload-config'
import { updateTag } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import { CLARITY_TAG, getClarityStats, RECHECK_COOLDOWN_MS } from '@/lib/clarity'

/**
 * "Check again" on the Statistics page while Clarity has no visits yet. Only
 * signed-in editors, only while empty, at most hourly — each check spends one
 * of the 10 daily Clarity requests.
 */
export async function recheckClarity() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return

  const current = await getClarityStats()
  if (current.status !== 'empty') return
  if (Date.now() - (current.fetchedAt ?? 0) < RECHECK_COOLDOWN_MS) return
  updateTag(CLARITY_TAG)
}
