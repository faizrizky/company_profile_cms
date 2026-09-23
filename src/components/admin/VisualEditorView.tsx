'use client'

import { DefaultEditView, useDocumentInfo, useLocale, useTranslation } from '@payloadcms/ui'
import { useEffect, useRef, useState, type ComponentProps } from 'react'

type Props = ComponentProps<typeof DefaultEditView> & { frontendUrl: string }

/**
 * Default view for Pages: the drag & drop visual editor (served by the
 * website at /studio) embedded inside the admin. The classic form stays in
 * the "Form" tab and is used to create new pages.
 */
export function VisualEditorView({ frontendUrl, ...props }: Props) {
  const { id } = useDocumentInfo()
  const locale = useLocale()
  const { i18n } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number>()

  // Fill the space between the document header and the bottom of the window,
  // whatever the header / nav state is.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fit = () => setHeight(Math.max(560, window.innerHeight - el.getBoundingClientRect().top))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(document.body)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [])

  if (!id) return <DefaultEditView {...props} />

  const ui = i18n.language === 'id' ? 'id' : 'en'
  const src = `${frontendUrl}/studio/pages/${id}?locale=${locale.code}&ui=${ui}&embed=1`
  return (
    <div ref={ref} className="falah-visual" style={height ? { height } : undefined}>
      {/* Mount the editor only once the frame has its final size, so it lays
          itself out for the real width (not a phone-sized first paint). */}
      {height ? (
        <iframe
          key={src}
          className="falah-visual__frame"
          src={src}
          title={ui === 'id' ? 'Editor visual' : 'Visual editor'}
          allow="clipboard-read; clipboard-write"
        />
      ) : null}
    </div>
  )
}
