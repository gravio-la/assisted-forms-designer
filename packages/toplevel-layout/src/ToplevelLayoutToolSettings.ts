import type { ToolSetting, JsonSchema } from '@formswizard/types'
import { COLOR_THEME_IDS, type ColorThemeId } from './colorThemes'

const jsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    headline: {
      type: 'string',
      title: 'Headline',
      i18n: 'toplevelLayout.headline',
    },
    description: {
      type: 'string',
      title: 'Subtitle / description',
      i18n: 'toplevelLayout.subtitle',
    },
    colorTheme: {
      type: 'string',
      title: 'Color theme',
      i18n: 'toplevelLayout.colorTheme',
      enum: [...COLOR_THEME_IDS],
    },
    image: {
      type: 'string',
      title: 'Header image',
      format: 'data-url',
      description: 'JPEG, PNG, WebP, or SVG. Stored in the form (no upload API).',
      i18n: 'toplevelLayout.image',
    },
    disableRoundedBox: {
      type: 'boolean',
      title: 'Disable rounded box',
      i18n: 'toplevelLayout.disableRoundedBox',
    },
    cardElevation: {
      type: 'integer',
      minimum: 0,
      maximum: 24,
      title: 'Card elevation',
      description: '0–24 (MUI shadows). Leave empty for the default elevation.',
      i18n: 'toplevelLayout.cardElevation',
    },
    fullWidth: {
      type: 'boolean',
      title: 'Full width layout',
      description:
        'Use the full content width for the card. Turn on for wide layouts (categorization, steppers). Default is a narrow column for typical forms.',
      i18n: 'toplevelLayout.fullWidth',
    },
  },
}

const mapWizardSchemaToToolData = (_wizardSchema: JsonSchema | null, uiSchema: unknown) => {
  const opts =
    uiSchema && typeof uiSchema === 'object' && uiSchema !== null && 'options' in uiSchema
      ? (uiSchema as { options?: Record<string, unknown> }).options
      : undefined
  return {
    headline: (opts?.headline as string | undefined) ?? '',
    description: (opts?.description as string | undefined) ?? '',
    colorTheme: (opts?.colorTheme as ColorThemeId | undefined) ?? 'default',
    image: (opts?.image as string | undefined) ?? '',
    disableRoundedBox: opts?.disableRoundedBox === true,
    fullWidth: opts?.fullWidth === true,
    cardElevation:
      typeof opts?.cardElevation === 'number' && Number.isFinite(opts.cardElevation)
        ? opts.cardElevation
        : undefined,
  }
}

const mapToolDataToWizardSchema = (toolData: unknown, wizardSchema: JsonSchema | null) => {
  return {
    ...(wizardSchema ?? {}),
  } as JsonSchema
}

const mapToolDataToWizardUischema = (toolData: unknown, wizardUiSchema: unknown) => {
  const base =
    wizardUiSchema && typeof wizardUiSchema === 'object' && wizardUiSchema !== null
      ? { ...(wizardUiSchema as object) }
      : { elements: [] }

  const td = toolData as {
    headline?: string
    description?: string
    colorTheme?: ColorThemeId
    image?: string
    disableRoundedBox?: boolean
    fullWidth?: boolean
    cardElevation?: number
  }

  const options: Record<string, unknown> = {
    ...((base as { options?: Record<string, unknown> }).options ?? {}),
  }

  if (td.headline !== undefined && td.headline !== '') {
    options.headline = td.headline
  } else {
    delete options.headline
  }

  if (td.description !== undefined && td.description !== '') {
    options.description = td.description
  } else {
    delete options.description
  }

  if (td.colorTheme !== undefined && td.colorTheme !== 'default') {
    options.colorTheme = td.colorTheme
  } else if (td.colorTheme === 'default') {
    delete options.colorTheme
  }

  if (td.image !== undefined && td.image !== '') {
    options.image = td.image
  } else {
    delete options.image
  }

  if (td.disableRoundedBox === true) {
    options.disableRoundedBox = true
  } else {
    delete options.disableRoundedBox
  }

  if (td.fullWidth === true) {
    options.fullWidth = true
  } else {
    delete options.fullWidth
  }

  if (
    td.cardElevation !== undefined &&
    typeof td.cardElevation === 'number' &&
    Number.isFinite(td.cardElevation)
  ) {
    options.cardElevation = Math.max(0, Math.min(24, Math.round(td.cardElevation)))
  } else {
    delete options.cardElevation
  }

  const result: Record<string, unknown> = {
    ...base,
    type: 'TopLevelLayout',
    options: Object.keys(options).length > 0 ? options : undefined,
  }

  if (!result.options) {
    delete result.options
  }

  return result
}

export const ToplevelLayoutToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: (uiSchema) => (uiSchema && (uiSchema as { type?: string }).type === 'TopLevelLayout' ? 5 : 0),
  toolSettingsMixins: [],
  uischemaScopeOverrides: {
    '#/properties/image': {
      type: 'Control',
      scope: '#/properties/image',
      options: {
        maxImageBytes: 1024 * 1024,
      },
    },
  },
}
