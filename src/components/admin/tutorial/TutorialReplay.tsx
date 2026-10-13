'use client'

import { useAuth, useDocumentInfo } from '@payloadcms/ui'

import type { User } from '@/payload-types'

import { useAdminText } from '../useAdminText'
import { TUTORIAL_TEXT } from './text'
import { useTutorial } from './TutorialProvider'

/** Sidebar of your own account page: replay the guided tour. */
export function TutorialReplay() {
  const { id } = useDocumentInfo()
  const { user } = useAuth<User>()
  const { choose, running } = useTutorial()
  const t = useAdminText(TUTORIAL_TEXT)

  if (!id || String(user?.id) !== String(id)) return null

  return (
    <div className="falah-tutorial-replay field-type">
      <span className="falah-tutorial-replay__label">{t.tour}</span>
      <p className="falah-tutorial-replay__help">{t.replayHelp}</p>
      <button type="button" className="falah-tutorial-replay__button" onClick={choose} disabled={running}>
        {t.replay}
      </button>
    </div>
  )
}
