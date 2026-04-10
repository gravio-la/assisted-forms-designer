import { i18nInstance } from '@formswizard/i18n'
import { useEffect, useMemo, useState } from 'react'

export const UPLOAD_TOOLS_NS = 'upload-tools'

/**
 * Translations for `@formswizard/upload-tools` (namespace registered by ToolProvider).
 */
export function useUploadToolsTranslation() {
  const [lang, setLang] = useState(i18nInstance.language)

  useEffect(() => {
    const handler = (lng: string) => setLang(lng)
    i18nInstance.on('languageChanged', handler)
    return () => {
      i18nInstance.off('languageChanged', handler)
    }
  }, [])

  const t = useMemo(() => {
    const tRaw = i18nInstance.t.bind(i18nInstance) as (...a: unknown[]) => unknown
    return (key: string, options?: Record<string, unknown>): string =>
      String(tRaw(key, { ns: UPLOAD_TOOLS_NS, ...options }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return { t }
}
