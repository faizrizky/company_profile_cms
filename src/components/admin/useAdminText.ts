'use client'

import { useTranslation } from '@payloadcms/ui'

export type AdminLang = 'en' | 'id'

/** The admin's interface language (Payload's language switcher). */
export function useAdminLang(): AdminLang {
  const { i18n } = useTranslation()
  return i18n.language === 'id' ? 'id' : 'en'
}

/** Picks a component's strings for the admin's language: `useAdminText({ en: {…}, id: {…} })`. */
export function useAdminText<T>(text: Record<AdminLang, T>): T {
  return text[useAdminLang()]
}
