import type { UISchemaElement } from '@jsonforms/core'

/**
 * Default root layout for new definitions / empty switches — TopLevel chrome with an empty vertical stack.
 * Kept as plain JSON (no import from @formswizard/toplevel-layout) to avoid package cycles.
 */
export const DEFAULT_ROOT_UI_SCHEMA: UISchemaElement = {
  type: 'TopLevelLayout',
  elements: [
    {
      type: 'VerticalLayout',
      elements: [],
    },
  ],
  options: {
    colorTheme: 'default',
  },
}
