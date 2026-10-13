/**
 * A short CSS selector that finds `el` again on a later visit, for the
 * tutorial's element picker. Prefers what survives re-renders and data
 * changes (ids, data attributes, component class names) over
 * positions. Keep in sync with the website's lib/studio/tutorial-selector.ts.
 */

// Generated ids (React's :r1:, Payload's field paths…) change between renders.
const STABLE_ID = /^[a-z][\w-]*$/i
// Not aria-label or title: they follow the interface language.
const STABLE_ATTRS = ['data-falah-tab', 'data-tour', 'data-testid', 'name']
// State classes come and go (active, open, hover…): never part of a selector.
const STATE_CLASS = /(^|[-_])(active|open|opened|visible|hidden|hover|focus|selected|disabled|ready|loading|is|has|show)(?=$|[-_])/i

function cssEscape(value: string) {
  return typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(value) : value.replace(/["\\]/g, '\\$&')
}

/** CSS-module class names (`_PuckCanvas-inner_zw9iy_34`) keep their readable part only. */
function classSelector(name: string) {
  const hashed = name.match(/^(_[A-Za-z][\w-]*?)_[a-z0-9]{4,}_\d+$/)
  if (hashed) return `[class*="${hashed[1]}_"]`
  return `.${cssEscape(name)}`
}

function ownSelector(el: Element): string[] {
  const options: string[] = []
  if (el.id && STABLE_ID.test(el.id)) options.push(`#${cssEscape(el.id)}`)
  for (const attr of STABLE_ATTRS) {
    const value = el.getAttribute(attr)
    if (value && value.length <= 60) options.push(`${el.localName}[${attr}="${cssEscape(value)}"]`)
  }
  const classes = [...el.classList].filter((c) => !STATE_CLASS.test(c) && !/\d{3,}/.test(c.replace(/_\d+$/, '')))
  if (classes.length) options.push(classes.slice(0, 2).map(classSelector).join(''))
  return options
}

function matches(selector: string, root: ParentNode) {
  try {
    return root.querySelectorAll(selector).length
  } catch {
    return 0
  }
}

export function uniqueSelector(el: Element, root: ParentNode = document): string {
  const parts: string[] = []
  let node: Element | null = el
  for (let depth = 0; node && node !== document.body && depth < 5; depth++) {
    const own = ownSelector(node)
    // One that already identifies it on its own (with the parts below).
    for (const option of own) {
      const candidate = [option, ...parts].join(' ')
      if (matches(candidate, root) === 1) return candidate
    }
    // Otherwise pin it down among its siblings and go up a level.
    const parent: Element | null = node.parentElement
    const base = own.at(-1) ?? node.localName
    const siblings = parent ? [...parent.children].filter((c) => c.localName === node!.localName) : []
    const nth = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(node) + 1})` : ''
    parts.unshift(own.length ? base : `${node.localName}${nth}`)
    node = parent
  }
  return parts.join(' ')
}
