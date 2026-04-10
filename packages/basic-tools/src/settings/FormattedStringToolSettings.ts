import { ToolsettingParts } from '@formswizard/fieldsettings'
import { ToolSetting, JsonSchema } from '@formswizard/types'

/** Title + description only for string fields with JSON Schema `format` (date, date-time, etc.). */
const mapWizardSchemaToToolData = () => ({})

const mapToolDataToWizardUischema = (_toolData: unknown, wizardUiSchema: unknown) => wizardUiSchema

const mapToolDataToWizardSchema = (_toolData: unknown, wizardSchema: JsonSchema | null) =>
  wizardSchema ?? {}

const FormattedStringToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema: { type: 'object', properties: {} },
  tester: (uiSchema, jsonSchema) => {
    if (!uiSchema || uiSchema.type !== 'Control' || jsonSchema?.type !== 'string') return 0
    const format = (jsonSchema as { format?: string }).format
    return format ? 1 : 0
  },
  toolSettingsMixins: [ToolsettingParts.Title, ToolsettingParts.Description],
}

export default FormattedStringToolSettings
