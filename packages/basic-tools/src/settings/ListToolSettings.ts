import { ToolsettingParts } from '@formswizard/fieldsettings'
import { resolveSchema, type TesterContext } from '@jsonforms/core'
import type { ToolSetting, JsonSchema, ScopeOverrides } from '@formswizard/types'

/** Stored as oneOf const values (translatable via columnType.<const>). */
const COLUMN_TYPES = ['text', 'number', 'email', 'date', 'dateTime', 'boolean'] as const
type ListColumnType = (typeof COLUMN_TYPES)[number]

const columnTypeToSchema: Record<ListColumnType, JsonSchema> = {
  text: { type: 'string' },
  number: { type: 'number' },
  email: { type: 'string', format: 'email' },
  date: { type: 'string', format: 'date' },
  dateTime: { type: 'string', format: 'date-time' },
  boolean: { type: 'boolean' },
}

const columnTypeOneOf: { const: ListColumnType }[] = COLUMN_TYPES.map((c) => ({ const: c }))

function inferColumnType(propSchema: JsonSchema | undefined): ListColumnType {
  if (!propSchema || typeof propSchema !== 'object') return 'text'
  const s = propSchema as Record<string, unknown>
  if (s.type === 'boolean') return 'boolean'
  if (s.format === 'date-time') return 'dateTime'
  if (s.format === 'email') return 'email'
  if (s.format === 'date') return 'date'
  if (s.type === 'number' || s.type === 'integer') return 'number'
  // Legacy: enum-based “option” columns → plain text
  if (Array.isArray(s.enum)) return 'text'
  return 'text'
}

function getResolvedItemsSchema(
  arraySchema: JsonSchema | null | undefined,
  rootSchema: JsonSchema
): JsonSchema | undefined {
  if (!arraySchema || typeof arraySchema !== 'object') return undefined
  const arr = arraySchema as { type?: string; items?: JsonSchema }
  if (arr.type !== 'array' || !arr.items || typeof arr.items !== 'object') return undefined
  let items = arr.items as JsonSchema & { $ref?: string }
  if (items.$ref && rootSchema) {
    const resolved = resolveSchema(rootSchema, items.$ref, rootSchema)
    if (resolved && typeof resolved === 'object') {
      items = resolved as JsonSchema & { $ref?: string }
    }
  }
  if ((items as { type?: string }).type !== 'object') return undefined
  return items
}

function isPropertyComplex(p: JsonSchema | undefined): boolean {
  if (!p || typeof p !== 'object') return true
  const s = p as Record<string, unknown>
  if (s.$ref) return true
  if (s.type === 'object' || s.type === 'array') return true
  if (s.anyOf || s.allOf || s.oneOf) return true
  return false
}

function detailIsNonDefault(detail: unknown): boolean {
  if (detail == null) return false
  if (typeof detail === 'string') {
    return detail.toUpperCase() !== 'DEFAULT'
  }
  if (typeof detail === 'object' && detail !== null && 'type' in (detail as object)) {
    return true
  }
  return false
}

/**
 * Activates only for "simple" list-of-objects: flat primitive item properties.
 * Backs off when JSON Forms would treat the array as nested (cf. isObjectArrayWithNesting).
 */
function isSimpleListOfObjectsForToolSettings(
  uiSchema: unknown,
  jsonSchema: JsonSchema | null | undefined,
  context: TesterContext
): boolean {
  if (!jsonSchema || typeof jsonSchema !== 'object') return false
  const rootSchema = context?.rootSchema ?? (jsonSchema as JsonSchema)
  const items = getResolvedItemsSchema(jsonSchema as JsonSchema, rootSchema)
  if (!items) return false
  const props = (items as { properties?: Record<string, JsonSchema> }).properties ?? {}
  if (Object.values(props).some((p) => isPropertyComplex(p))) return false
  const opt = (uiSchema as { options?: { detail?: unknown } })?.options
  if (opt?.detail != null && detailIsNonDefault(opt.detail)) return false
  return true
}

const jsonSchema = {
  type: 'object',
  properties: {
    columns: {
      type: 'array',
      title: 'Columns',
      description:
        'For nested row content, use an advanced list from the palette—this panel stays off for complex item schemas.',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', title: 'Name' },
          columnType: {
            title: 'Type',
            default: 'text',
            oneOf: columnTypeOneOf,
          },
        },
        required: ['name', 'columnType'],
      },
    },
    showSortButtons: {
      type: 'boolean',
      title: 'showSortButtons',
    },
  },
}

const uischemaScopeOverrides: ScopeOverrides = {
  '#/properties/columns': {
    type: 'Control',
    scope: '#/properties/columns',
    options: {
      showSortButtons: false,
    },
  } as ScopeOverrides[string],
  '#/properties/columns/items/properties/columnType': {
    type: 'Control',
    scope: '#/properties/columns/items/properties/columnType',
    options: {
      format: 'radio',
    },
  } as ScopeOverrides[string],
}

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  const properties = (wizardSchema as { items?: { properties?: Record<string, JsonSchema> } })?.items?.properties ?? {}
  const columns = Object.entries(properties).map(([name, propSchema]) => ({
    name,
    columnType: inferColumnType(propSchema),
  }))
  return {
    columns,
    showSortButtons: uiSchema?.options?.showSortButtons === true,
  }
}

const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any) => {
  return {
    ...wizardUiSchema,
    options: {
      ...(wizardUiSchema?.options ?? {}),
      showSortButtons: toolData.showSortButtons === true,
    },
  }
}

const mapToolDataToWizardSchema = (toolData: any, wizardSchema: JsonSchema | null, _rootSchema: JsonSchema) => {
  const newProperties = (toolData.columns as { name: string; columnType: ListColumnType }[]).reduce(
    (prev: Record<string, JsonSchema>, col: { name: string; columnType: ListColumnType }) => {
      const key = col.name
      if (!key) return prev
      const t = col.columnType
      const fragment: JsonSchema = columnTypeToSchema[t] ?? columnTypeToSchema.text
      return { ...prev, [key]: fragment }
    },
    {}
  )

  return {
    ...wizardSchema,
    items: {
      ...(wizardSchema as { items?: object }).items,
      properties: newProperties,
    },
  }
}

const ListToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  uischemaScopeOverrides,
  tester: (uiSchema, jsonSchema, context) =>
    isSimpleListOfObjectsForToolSettings(uiSchema, jsonSchema, context) ? 5 : 0,
  toolSettingsMixins: [ToolsettingParts.Title, ToolsettingParts.Description],
}
export default ListToolSettings
