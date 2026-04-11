import type { LanguageTranslations } from '@formswizard/types'

/** i18n for AdvancedListToolSettings (field settings panel). Namespace = `designer-renderer` (info.name). */
export const advancedListToolTranslations: LanguageTranslations = {
  en: {
    'showSortButtons.label': 'Show sort buttons',
    'elementLabelProp.label': 'Row label field',
    'elementLabelProp.description':
      'Which primitive field to use as the row label. Default follows the first suitable field in the item schema.',
    'elementLabelProp.default': 'Default (first suitable field)',
  },
  de: {
    'showSortButtons.label': 'Sortierschaltflächen anzeigen',
    'elementLabelProp.label': 'Zeilenbeschriftung (Feld)',
    'elementLabelProp.description':
      'Welches einfache Feld als Zeilenbeschriftung dient. „Standard“ entspricht dem ersten passenden Feld im Item-Schema.',
    'elementLabelProp.default': 'Standard (erstes passendes Feld)',
  },
}
