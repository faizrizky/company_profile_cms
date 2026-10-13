/**
 * postMessage protocol between the admin and the visual editor (the website's
 * studio, in a cross-origin iframe) for steps highlighting an element inside
 * the editor. Keep in sync with the website's components/studio/tutorial-bridge.tsx.
 *
 *   admin → editor  { type: MEASURE, id, selector, click?, scroll? }
 *   editor → admin  { type: MEASURED, id, rect | null }   rect in the iframe's viewport
 *   admin → editor  { type: PICK, on }                     element picker on / off
 *   editor → admin  { type: PICKED, selector }
 */
export const TUTORIAL_MEASURE = 'falah-tutorial:measure'
export const TUTORIAL_MEASURED = 'falah-tutorial:measured'
export const TUTORIAL_PICK = 'falah-tutorial:pick'
export const TUTORIAL_PICKED = 'falah-tutorial:picked'

/** Between the settings page and the picker window it opens (same origin). */
export const TUTORIAL_PICK_RESULT = 'falah-tutorial:pick-result'
/** Query parameter that turns an admin window into the element picker. */
export const PICK_PARAM = 'falahTutorialPick'

export type Rect = { x: number; y: number; width: number; height: number }
