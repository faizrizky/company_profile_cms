/** Login screen logo. */
export function Logo() {
  return (
    <div className="falah-brand falah-brand--lg">
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand mark */}
      <img className="falah-brand__mark" src="/falah-icon.png" alt="" width={40} height={40} />
      <span className="falah-brand__name">Falah CMS</span>
    </div>
  )
}
