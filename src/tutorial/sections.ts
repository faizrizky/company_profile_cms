import type { TutorialStep } from './steps'

/**
 * Which part of the tutorial a step belongs to, so one part can be played on
 * its own: the sidebar page its route is on (the id of that sidebar item,
 * see FalahNav), the introduction, or the account page. Derived from the
 * route, so steps added in the settings fall into the right part by themselves.
 */

export const INTRO_SECTION = 'intro'
export const ACCOUNT_SECTION = 'account'

export function stepSection(step: Pick<TutorialStep, 'route' | 'target'>): string {
  const path = (step.route ?? '').trim().replace(/^\/+/, '').split('?')[0]
  const [kind, slug] = path.split('/')
  if (!path) {
    // On the first screen: the welcome card and the menu itself are the
    // introduction; the rest is about the statistics.
    const target = (step.target ?? '').trim()
    return !target || /^\.nav\b/.test(target) ? INTRO_SECTION : 'nav-statistics'
  }
  if (kind === 'collections' && slug) return `nav-${slug}`
  if (kind === 'globals' && slug) return `nav-global-${slug}`
  return kind === 'account' ? ACCOUNT_SECTION : kind
}

/** The sidebar section of an admin path (after the admin route), for "this page". */
export function pathSection(path: string): string {
  return stepSection({ route: path || '', target: 'x' })
}
