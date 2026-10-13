'use client'

import {
  CheckboxInput,
  ConfirmationModal,
  TextareaInput,
  TextInput,
  useField,
  useModal,
} from '@payloadcms/ui'
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'

import { newStepId, stepsProblem } from '@/tutorial/normalize'
import { DEFAULT_TUTORIAL_STEPS, type TutorialRole, type TutorialStep } from '@/tutorial/steps'

import { useAdminLang, useAdminText } from '../useAdminText'
import { TUTORIAL_TEXT, type TutorialText } from './text'
import { MISSING_KEY } from './TutorialProvider'
import { usePickElement } from './usePickElement'

const ROLES: TutorialRole[] = ['admin', 'editor']
const DELETE_MODAL = 'tutorial-delete-step'
const noopSubscribe = () => () => {}

/** Steps whose element the tour last couldn't find on this browser (by id). */
function useMissing(): Record<string, number> {
  const raw = useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return window.localStorage.getItem(MISSING_KEY) ?? '{}'
      } catch {
        return '{}'
      }
    },
    () => '{}',
  )
  return useMemo(() => {
    try {
      return JSON.parse(raw) as Record<string, number>
    } catch {
      return {}
    }
  }, [raw])
}

const titleOf = (step: TutorialStep, lang: 'en' | 'id', t: TutorialText) =>
  (lang === 'id' ? step.titleId || step.titleEn : step.titleEn || step.titleId) || t.untitled

/**
 * Settings → Tutorial → Steps, for people who don't write code: a list of the
 * steps where only the open one shows its inputs (title and text in both
 * languages, who sees it). What gets highlighted is chosen by clicking it in
 * "Pick element" and only shown here. Edits the `steps` JSON value; saved with
 * the page.
 */
export function TutorialStepsEditor({ path }: { path: string }) {
  const t = useAdminText(TUTORIAL_TEXT)
  const lang = useAdminLang()
  // Same rule as the server (Tutorial.ts), checked on save.
  const validate = useCallback((v: unknown) => stepsProblem(v, lang) ?? true, [lang])
  const { value, setValue, errorMessage } = useField<TutorialStep[] | null>({ path, validate })
  // Never saved yet: the default steps.
  const steps = useMemo(() => (Array.isArray(value) ? value : DEFAULT_TUTORIAL_STEPS), [value])
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<TutorialStep | null>(null)
  const { openModal } = useModal()
  const missing = useMissing()
  // Once a save was refused (Payload sets errorMessage but not showError for a
  // custom field), the current problem — gone as soon as it's fixed.
  const problem = errorMessage ? stepsProblem(steps, lang) : null

  const change = (id: string, patch: Partial<TutorialStep>) =>
    setValue(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  const move = (index: number, by: -1 | 1) => {
    const next = [...steps]
    const [step] = next.splice(index, 1)
    next.splice(index + by, 0, step)
    setValue(next)
  }
  const add = () => {
    const step: TutorialStep = {
      id: newStepId(),
      enabled: true,
      roles: [...ROLES],
      frame: 'admin',
      route: '',
      target: '',
      clickFirst: '',
      titleId: '',
      titleEn: '',
      bodyId: '',
      bodyEn: '',
    }
    const at = openId ? steps.findIndex((s) => s.id === openId) + 1 : steps.length
    setValue([...steps.slice(0, at), step, ...steps.slice(at)])
    setOpenId(step.id)
  }

  return (
    <div className="falah-steps">
      <div className="falah-steps__head">
        <span className="falah-steps__count">{t.count(steps.length)}</span>
        <button type="button" className="falah-steps__add" onClick={add}>
          <span aria-hidden>+</span> {t.addStep}
        </button>
      </div>
      {problem ? (
        <p className="falah-steps__error" role="alert">
          {problem}
        </p>
      ) : null}
      <ol className="falah-steps__list">
        {steps.map((step, index) => {
          const open = step.id === openId
          const roles = step.roles?.length ? step.roles : ROLES
          return (
            <li
              key={step.id}
              className={`falah-steps__item${open ? ' is-open' : ''}${step.enabled === false ? ' is-off' : ''}`}
            >
              <div className="falah-steps__row">
                <button
                  type="button"
                  className="falah-steps__toggle"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : step.id)}
                >
                  <span className="falah-steps__num">{index + 1}</span>
                  <span className="falah-steps__title">{titleOf(step, lang, t)}</span>
                  <span className="falah-steps__tags">
                    {roles.length < 2 ? (
                      <span className="falah-steps__tag">{roles[0] === 'admin' ? 'Admin' : 'Editor'}</span>
                    ) : null}
                    {step.frame === 'editor' ? <span className="falah-steps__tag">{t.inEditor}</span> : null}
                    {step.enabled === false ? <span className="falah-steps__tag">{t.inactive}</span> : null}
                    {missing[step.id] ? (
                      <span className="falah-steps__tag is-warn" title={t.missing}>
                        !
                      </span>
                    ) : null}
                  </span>
                  <svg className="falah-steps__chevron" viewBox="0 0 24 24" aria-hidden>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <span className="falah-steps__moves">
                  <button type="button" aria-label={t.moveUp} disabled={index === 0} onClick={() => move(index, -1)}>
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 19V5" />
                      <path d="m6 11 6-6 6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label={t.moveDown}
                    disabled={index === steps.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 5v14" />
                      <path d="m18 13-6 6-6-6" />
                    </svg>
                  </button>
                </span>
              </div>
              {open ? (
                <StepForm
                  step={step}
                  t={t}
                  missing={Boolean(missing[step.id])}
                  onChange={(patch) => change(step.id, patch)}
                  onDelete={() => {
                    setDeleting(step)
                    openModal(DELETE_MODAL)
                  }}
                />
              ) : null}
            </li>
          )
        })}
      </ol>
      <ConfirmationModal
        className="falah-confirm--danger"
        modalSlug={DELETE_MODAL}
        heading={t.deleteHeading}
        body={deleting ? t.deleteBody(titleOf(deleting, lang, t)) : ''}
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        onConfirm={() => {
          if (deleting) setValue(steps.filter((s) => s.id !== deleting.id))
          setDeleting(null)
          setOpenId(null)
        }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

function StepForm({
  step,
  t,
  missing,
  onChange,
  onDelete,
}: {
  step: TutorialStep
  t: TutorialText
  missing: boolean
  onChange: (patch: Partial<TutorialStep>) => void
  onDelete: () => void
}) {
  const { pick, waiting } = usePickElement()
  const roles = step.roles?.length ? step.roles : ROLES
  const toggleRole = (role: TutorialRole) =>
    onChange({ roles: roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role] })
  const field = (key: string) => `tutorial-step-${step.id}-${key}`
  const target = step.target?.trim()
  const pickElement = () =>
    pick(step.route ?? '', ({ selector, frame, route }) =>
      // A newly picked element has no tab to open first.
      onChange({ target: selector, frame, route, clickFirst: '' }),
    )

  return (
    <div className="falah-steps__form">
      <section className="falah-steps__section">
        <h4>{t.sectionShow}</h4>
        <div className="falah-steps__checks">
          <CheckboxInput
            id={field('enabled')}
            label={t.active}
            checked={step.enabled !== false}
            onToggle={(e) => onChange({ enabled: e.target.checked })}
          />
          <span className="falah-steps__divider" aria-hidden />
          <span className="falah-steps__checks-label">{t.shownTo}</span>
          {ROLES.map((role) => (
            <CheckboxInput
              key={role}
              id={field(`role-${role}`)}
              label={role === 'admin' ? 'Admin' : 'Editor'}
              checked={roles.includes(role)}
              onToggle={() => toggleRole(role)}
            />
          ))}
        </div>
        <p className="falah-steps__help">{t.activeHelp}</p>
      </section>

      <section className="falah-steps__section">
        <h4>{t.sectionSpot}</h4>
        <div className={`falah-steps__spot${target ? ' is-set' : ''}`}>
          <span className="falah-steps__spot-icon" aria-hidden>
            {target ? '✓' : '○'}
          </span>
          <span>{target ? t.spotSet : t.spotNone}</span>
        </div>
        {target ? (
          <div className="falah-steps__pair">
            <TextInput
              path={field('route')}
              label={t.page}
              value={step.route?.trim() || t.pageHome}
              readOnly
              onChange={() => {}}
            />
            <TextInput
              path={field('frame')}
              label={t.place}
              value={step.frame === 'editor' ? t.frameEditor : t.frameAdmin}
              readOnly
              onChange={() => {}}
            />
          </div>
        ) : null}
        {target ? (
          <TextInput
            path={field('target')}
            label={t.target}
            description={t.targetHelp}
            value={target}
            readOnly
            onChange={() => {}}
          />
        ) : null}
        {missing ? <p className="falah-steps__warn">{t.missing}</p> : null}
        <div className="falah-steps__spot-actions">
          <button type="button" className="falah-steps__pick" onClick={pickElement} aria-busy={waiting}>
            {target ? t.pickAgain : t.pick}
          </button>
          {target ? (
            <button
              type="button"
              className="falah-steps__link"
              onClick={() => onChange({ target: '', clickFirst: '', frame: 'admin' })}
            >
              {t.clearSpot}
            </button>
          ) : null}
        </div>
        <p className="falah-steps__help">{t.pickHelp}</p>
      </section>

      <section className="falah-steps__section">
        <h4>{t.sectionText}</h4>
        <div className="falah-steps__pair">
          <TextInput
            path={field('titleId')}
            label={t.titleId}
            required
            value={step.titleId ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ titleId: e.target.value.slice(0, 80) })}
          />
          <TextInput
            path={field('titleEn')}
            label={t.titleEn}
            required
            value={step.titleEn ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ titleEn: e.target.value.slice(0, 80) })}
          />
        </div>
        <div className="falah-steps__pair">
          <TextareaInput
            path={field('bodyId')}
            label={t.bodyId}
            required
            rows={5}
            value={step.bodyId ?? ''}
            onChange={(e) => onChange({ bodyId: e.target.value.slice(0, 600) })}
          />
          <TextareaInput
            path={field('bodyEn')}
            label={t.bodyEn}
            required
            rows={5}
            value={step.bodyEn ?? ''}
            onChange={(e) => onChange({ bodyEn: e.target.value.slice(0, 600) })}
          />
        </div>
        <p className="falah-steps__help">{t.bodyHelp}</p>
      </section>

      <div className="falah-steps__footer">
        <button type="button" className="falah-steps__delete" onClick={onDelete}>
          {t.deleteStep}
        </button>
      </div>
    </div>
  )
}
