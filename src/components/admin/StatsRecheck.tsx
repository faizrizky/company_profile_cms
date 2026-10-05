'use client'

import { useFormStatus } from 'react-dom'

import { recheckClarity } from '@/actions/refreshClarity'

function Submit({ label, busy, disabled }: { label: string; busy: string; disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="falah-stats__open falah-stats__recheck" disabled={disabled || pending}>
      {pending ? busy : label}
    </button>
  )
}

/** "Check again" while Clarity has no visits yet (with when it last looked). */
export function StatsRecheck({
  checked,
  label,
  busy,
  wait,
}: {
  /** "Checked 12 min ago". */
  checked: string
  label: string
  busy: string
  /** Set while the hourly cooldown runs: "Available in 48 min". */
  wait: string | null
}) {
  return (
    <form action={recheckClarity} className="falah-stats__recheck-row">
      <Submit label={label} busy={busy} disabled={wait !== null} />
      <span>{wait ? `${checked} · ${wait}` : checked}</span>
    </form>
  )
}
