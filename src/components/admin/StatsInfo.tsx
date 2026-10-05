/**
 * Small info badge (circled "i" icon) next to a statistics label; hover or focus shows what the
 * number means via the admin-wide themed tooltip ([data-falah-tooltip] in
 * Tooltips.tsx). A plain span — safe in both server and client components.
 */
export function Info({ text }: { text: string }) {
  return (
    <span
      className="falah-info"
      tabIndex={0}
      role="note"
      aria-label={text}
      data-falah-tooltip={text}
      data-falah-tooltip-placement="top"
    />
  )
}
