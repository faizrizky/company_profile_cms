'use client'

import { ConfirmationModal, toast, useConfig, useField, useModal } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

import { DEFAULT_TUTORIAL_STEPS } from '@/tutorial/steps'

import { useAdminText } from '../useAdminText'
import { TUTORIAL_TEXT } from './text'
import { useTutorial } from './TutorialProvider'

const SHOW_AGAIN_MODAL = 'tutorial-show-again'
const RESET_MODAL = 'tutorial-reset'

/** Sidebar of Settings → Tutorial, under the version: run it, show it again to everyone, restore the defaults. */
export function TutorialSettingsActions() {
  const { config } = useConfig()
  const router = useRouter()
  const t = useAdminText(TUTORIAL_TEXT)
  const { choose, running } = useTutorial()
  const { openModal } = useModal()
  const { value: version } = useField<number>({ path: 'version' })

  const save = async (data: Record<string, unknown>, doneText: string) => {
    const res = await fetch(`${config.serverURL}${config.routes.api}/globals/tutorial`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => null)
    if (res?.ok) {
      toast.success(doneText)
      router.refresh()
    } else {
      toast.error(t.failed)
    }
  }

  return (
    <div className="falah-tutorial-actions">
      <span className="falah-tutorial-actions__label">{t.actions}</span>
      <button type="button" className="falah-tutorial-actions__primary" onClick={choose} disabled={running}>
        {t.run}
      </button>
      <button type="button" onClick={() => openModal(SHOW_AGAIN_MODAL)}>
        {t.showAgain}
      </button>
      <button type="button" onClick={() => openModal(RESET_MODAL)}>
        {t.reset}
      </button>
      <ConfirmationModal
        modalSlug={SHOW_AGAIN_MODAL}
        heading={t.showAgainHeading}
        body={t.showAgainConfirm}
        confirmLabel={t.confirm}
        confirmingLabel={t.working}
        cancelLabel={t.cancel}
        onConfirm={() => save({ version: (version ?? 1) + 1 }, t.showAgainDone)}
      />
      <ConfirmationModal
        className="falah-confirm--danger"
        modalSlug={RESET_MODAL}
        heading={t.resetHeading}
        body={t.resetConfirm}
        confirmLabel={t.confirm}
        confirmingLabel={t.working}
        cancelLabel={t.cancel}
        onConfirm={() => save({ steps: DEFAULT_TUTORIAL_STEPS }, t.resetDone)}
      />
    </div>
  )
}
