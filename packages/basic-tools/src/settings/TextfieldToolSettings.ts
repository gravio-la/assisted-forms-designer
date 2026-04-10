import { RuleEffect, type UISchemaElement } from '@jsonforms/core'
import { ToolsettingParts } from '@formswizard/fieldsettings'
import { ToolSetting, JsonSchema, ScopeOverrides } from '@formswizard/types'

const DEFAULT_MULTILINE_ROWS = 3

const jsonSchema = {
  type: 'object',
  properties: {
    multiline: {
      type: 'boolean',
      title: 'multiline',
    },
    multilineRows: {
      type: 'integer',
      title: 'multilineRows',
      minimum: 2,
      maximum: 40,
      default: DEFAULT_MULTILINE_ROWS,
    },
  },
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  const multi = Boolean(uiSchema?.options?.multi)
  const minRows = uiSchema?.options?.minRows
  return {
    multiline: multi,
    multilineRows:
      multi && minRows != null && Number.isFinite(Number(minRows))
        ? Number(minRows)
        : DEFAULT_MULTILINE_ROWS,
  }
}

const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  const result = {
    ...wizardUiSchema,
    options: {
      ...(wizardUiSchema.options ?? {}),
    },
  }

  if (toolData.multiline) {
    result.options.multi = true
    const rows =
      toolData.multilineRows != null && Number.isFinite(Number(toolData.multilineRows))
        ? Math.min(40, Math.max(2, Math.round(Number(toolData.multilineRows))))
        : DEFAULT_MULTILINE_ROWS
    result.options.minRows = rows
  } else {
    delete result.options.multi
    delete result.options.minRows
  }

  if (Object.keys(result.options).length === 0) {
    delete result.options
  }

  return result
}

const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null) => {
  return {
    ...wizardSchema,
  }
}

const textfieldTester = (uiSchema: any, jsonSchema: JsonSchema | null | undefined) => {
  if (!uiSchema || uiSchema.type !== 'Control' || jsonSchema?.type !== 'string') return 0
  if ((jsonSchema as { format?: string }).format) return 0
  return 1
}

/** Visible rows only when multiline is enabled (tool settings form data: `multiline`). */
const uischemaScopeOverrides: ScopeOverrides = {
  '#/properties/multilineRows': {
    type: 'Control',
    scope: '#/properties/multilineRows',
    rule: {
      effect: RuleEffect.SHOW,
      condition: {
        scope: '#/properties/multiline',
        schema: { const: true },
      },
    },
  } as UISchemaElement,
}

const TextfieldToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  uischemaScopeOverrides,
  tester: textfieldTester,
  toolSettingsMixins: [ToolsettingParts.Title, ToolsettingParts.Description],
}
export default TextfieldToolSettings
