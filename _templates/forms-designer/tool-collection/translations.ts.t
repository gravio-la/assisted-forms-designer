---
to: packages/<%= name.split("/")[1] %>/src/translations.ts
---
import type { LanguageTranslations } from '@formswizard/types'

/** Registered under i18next namespace `info.name` from `toolCollection`. Keys are JsonForms `translate` ids (often `yourPrefix.fieldId.label`). */
export const translations: LanguageTranslations = {
  en: {},
  de: {},
}
