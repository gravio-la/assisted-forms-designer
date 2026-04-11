import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FORMSDESIGNER_NS, i18nInstance } from './i18nInstance'
import type { JsonFormsI18nState } from '@jsonforms/core'

/**
 * Returns a stable `JsonFormsI18nState` (`{ locale, translate }`) ready to be
 * passed directly to any `<JsonForms i18n={...} />` instance.
 *
 * Translation resolution order (first match wins):
 *   1. Each namespace in `extraNamespaces` (e.g. collection namespaces)
 *   2. The `formsdesigner` namespace — shared mixin labels + generic error messages
 *
 * @param extraNamespaces - Additional i18next namespaces to consult before the
 *   `formsdesigner` fallback. Pass `registeredCollections` from `useToolContext`
 *   to include all active tool-collection dictionaries.
 */
export function useJsonFormsI18n(extraNamespaces: string[] = []): JsonFormsI18nState {
  // useTranslation() with no args subscribes this component to language changes so
  // the translate function is re-created whenever the active language switches.
  // We do NOT pass namespaces here to avoid react-i18next v15 / TS4 type issues;
  // instead we call i18nInstance.t directly with explicit ns options below.
  const { i18n } = useTranslation()

  const namespaceKey = extraNamespaces.join(',')

  const translate = useMemo(
    () => {
      const ns = [...extraNamespaces, FORMSDESIGNER_NS]
      // Cast to any to work around i18next v25 requiring TypeScript 5 for its
      // generic t() overloads, while this monorepo still targets TypeScript 4.
      const tRaw = i18nInstance.t.bind(i18nInstance) as (...a: any[]) => any

      // A sentinel that can never appear as a real translation value.
      // i18next v25 ignores `null` as a defaultValue and returns the key string
      // instead — a unique sentinel avoids that ambiguity.
      const NOT_FOUND = '__FW_I18N_NOT_FOUND__'

      const fn = (key: string, defaultMessage?: string): string | undefined => {
        // Always use the sentinel as the i18next defaultValue so we can reliably
        // detect "key not found" regardless of i18next version quirks:
        //   - i18next v25 ignores null/undefined defaultValues (returns the key)
        //   - saveMissing in dev mode can cache the sentinel if called first with
        //     defaultMessage===undefined, then return it on a later call that has a
        //     real defaultMessage — causing __FW_I18N_NOT_FOUND__ to appear in the UI.
        // By always using the sentinel we detect both "not found" and "cached sentinel"
        // in one place and fall through to JsonForms' own defaultMessage.
        const result = tRaw(key, { ns, defaultValue: NOT_FOUND }) as string
        if (result === NOT_FOUND || result === key) {
          // Key is absent from all our namespaces — respect JsonForms' contract:
          //   • undefined → let JsonForms try its own further fallbacks
          //   • string   → pass the user-set label/description through as-is
          return defaultMessage
        }
        return result
      }
      return fn as JsonFormsI18nState['translate']
    },
    // i18n.language changes trigger a re-render via useTranslation(), which
    // causes this memo to re-run and produce a fresh translate function
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language, namespaceKey]
  )

  return useMemo(
    () => ({ locale: i18n.language, translate }),
    [i18n.language, translate]
  )
}
