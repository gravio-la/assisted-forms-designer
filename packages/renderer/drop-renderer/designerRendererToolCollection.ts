import type { FormsDesignerToolCollection } from '@formswizard/types'
import { AdvancedListToolSettings } from './AdvancedListToolSettings'
import { advancedListToolTranslations } from './advancedListToolTranslations'

/**
 * Tool settings and translations for drop-renderer features (e.g. advanced list row template).
 * Merge into `ToolProvider` alongside `basicToolsCollection`.
 */
export const designerRendererToolCollection: FormsDesignerToolCollection = {
  info: {
    name: 'designer-renderer',
    description: 'Designer edit-mode renderers (drop zones, advanced list, …)',
    categories: ['designer'],
  },
  toolSettings: [AdvancedListToolSettings],
  translations: advancedListToolTranslations,
}
