import type { JSX } from 'react'

/**
 * Loading placeholders shaped like the admin screens they stand in for.
 * Pure markup; the shimmer and layout live in custom.scss (`.falah-sk*`).
 */

const Block = ({ className = '' }: { className?: string }) => (
  <span className={`falah-sk ${className}`} aria-hidden />
)

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

function PageTitle({ actions = 0 }: { actions?: number }) {
  return (
    <div className="falah-sk-title">
      <Block className="falah-sk--title" />
      {range(actions).map((i) => (
        <Block key={i} className="falah-sk--pill" />
      ))}
    </div>
  )
}

function Field({ wide = false }: { wide?: boolean }) {
  return (
    <div className="falah-sk-field">
      <Block className="falah-sk--label" />
      <Block className={wide ? 'falah-sk--textarea' : 'falah-sk--input'} />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="falah-sk-page">
      {[4, 2, 3].map((cards, group) => (
        <section key={group} className="falah-sk-group">
          <Block className="falah-sk--heading" />
          <div className="falah-sk-cards">
            {range(cards).map((i) => (
              <div key={i} className="falah-sk-card falah-sk-card--tile">
                <Block className="falah-sk--label" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="falah-sk-page">
      <PageTitle actions={1} />
      <div className="falah-sk-card falah-sk-search">
        <Block className="falah-sk--input" />
        <Block className="falah-sk--pill" />
        <Block className="falah-sk--pill" />
      </div>
      <div className="falah-sk-card falah-sk-table">
        {range(8).map((row) => (
          <div key={row} className="falah-sk-row">
            <Block className="falah-sk--check" />
            <Block className="falah-sk--cell falah-sk--cell-lg" />
            <Block className="falah-sk--cell" />
            <Block className="falah-sk--cell" />
            <Block className="falah-sk--pill falah-sk--small" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EditSkeleton() {
  return (
    <div className="falah-sk-page">
      <PageTitle />
      <Block className="falah-sk--meta" />
      <div className="falah-sk-edit">
        <div className="falah-sk-edit__main">
          {[3, 2].map((fields, card) => (
            <div key={card} className="falah-sk-card falah-sk-card--fields">
              <Block className="falah-sk--label falah-sk--strong" />
              {range(fields).map((i) => (
                <Field key={i} wide={i === fields - 1 && card === 0} />
              ))}
            </div>
          ))}
        </div>
        <div className="falah-sk-edit__side">
          <Field />
          <Field />
        </div>
      </div>
    </div>
  )
}

/** The visual editor (Puck) layout: panels either side of the canvas. */
export function EditorSkeleton() {
  return (
    <div className="falah-sk-editor" aria-hidden>
      <div className="falah-sk-editor__bar">
        <Block className="falah-sk--icon" />
        <Block className="falah-sk--icon" />
        <span className="falah-sk-editor__spacer" />
        <Block className="falah-sk--pill" />
        <Block className="falah-sk--pill" />
        <Block className="falah-sk--pill falah-sk--accent" />
      </div>
      <div className="falah-sk-editor__body">
        <div className="falah-sk-editor__panel">
          {range(7).map((i) => (
            <Block key={i} className="falah-sk--item" />
          ))}
        </div>
        <div className="falah-sk-editor__canvas">
          <Block className="falah-sk--frame" />
        </div>
        <div className="falah-sk-editor__panel">
          {range(3).map((i) => (
            <Field key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function VisualSkeleton() {
  return (
    <div className="falah-sk-page">
      <PageTitle actions={2} />
      <div className="falah-sk-card falah-sk-card--editor">
        <EditorSkeleton />
      </div>
    </div>
  )
}

export type SkeletonKind = 'dashboard' | 'list' | 'edit' | 'visual'

/** Which placeholder fits an admin path. */
export function skeletonFor(pathname: string, adminRoute = '/admin'): SkeletonKind {
  const rest = pathname.startsWith(adminRoute) ? pathname.slice(adminRoute.length) : pathname
  const parts = rest.split('/').filter(Boolean)
  if (parts.length === 0) return 'dashboard'
  if (parts[0] === 'collections') {
    if (parts.length === 2) return 'list'
    // A page opens on the visual editor; its Form / Versions tabs and the
    // create screen are regular forms.
    if (parts[1] === 'pages' && parts.length === 3 && parts[2] !== 'create') return 'visual'
    return 'edit'
  }
  return 'edit'
}

export const skeletons: Record<SkeletonKind, () => JSX.Element> = {
  dashboard: DashboardSkeleton,
  list: ListSkeleton,
  edit: EditSkeleton,
  visual: VisualSkeleton,
}
