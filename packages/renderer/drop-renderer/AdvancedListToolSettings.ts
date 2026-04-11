import { ToolsettingParts } from '@formswizard/fieldsettings'
import { resolveSchema, uiTypeIs, and, rankWith, isObjectArray } from '@jsonforms/core'
import { resolveScopeWithoutRef } from '@formswizard/utils'
import type { ToolSetting, JsonSchema, ScopeOverrides } from '@formswizard/types'


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

function isUsableLabelLeaf(prop: JsonSchema | undefined): boolean {
  if (!prop || typeof prop !== 'object') return false
  const s = prop as Record<string, unknown>
  if (s.$ref) return false
  if (s.type === 'object' || s.type === 'array') return false
  if (s.anyOf || s.allOf || s.oneOf) return false
  const t = s.type
  return t === 'string' || t === 'number' || t === 'integer' || t === 'boolean'
}

export type LabelPathOption = { const: string; title: string }

/**
 * Dot-paths to primitive leaf fields under the item object (e.g. `name`, `addr.city`), with titles from JSON Schema.
 */
export function collectLabelPathOptions(
  itemSchema: JsonSchema | undefined,
  rootSchema: JsonSchema,
  prefix = ''
): LabelPathOption[] {
  if (!itemSchema || typeof itemSchema !== 'object') return []
  let obj = itemSchema as JsonSchema & { $ref?: string }
  if (obj.$ref && rootSchema) {
    const resolved = resolveSchema(rootSchema, obj.$ref, rootSchema)
    if (resolved && typeof resolved === 'object') obj = resolved as JsonSchema & { $ref?: string }
  }
  const props = (obj as { properties?: Record<string, JsonSchema> }).properties
  if (!props || typeof props !== 'object') return []

  const out: LabelPathOption[] = []
  for (const key of Object.keys(props).sort()) {
    const sub = props[key]
    const path = prefix ? `${prefix}.${key}` : key
    const title =
      sub && typeof sub === 'object' && (sub as { title?: string }).title
        ? String((sub as { title?: string }).title)
        : key

    if (isUsableLabelLeaf(sub)) {
      out.push({ const: path, title })
    } else if (
      sub &&
      typeof sub === 'object' &&
      (sub as { type?: string }).type === 'object' &&
      !(sub as { $ref?: string }).$ref
    ) {
      out.push(...collectLabelPathOptions(sub, rootSchema, path))
    }
  }
  return out
}

/** Single dot-path, or legacy array (first entry), or empty string for default. */
function normalizeElementLabelProp(raw: unknown): string {
  if (raw == null) return ''
  if (typeof raw === 'string') return raw.trim()
  if (Array.isArray(raw)) {
    const first = raw.find((x): x is string => typeof x === 'string')
    return first != null ? first.trim() : ''
  }
  return ''
}

function buildJsonSchemaForPanel(rootSchema: JsonSchema, selectedSchema: JsonSchema | null): JsonSchema {
  const items = getResolvedItemsSchema(selectedSchema, rootSchema)
  const paths = collectLabelPathOptions(items, rootSchema)

  const elementLabelPropSchema: JsonSchema =
    paths.length > 0
      ? {
          type: 'string',
          title: 'elementLabelProp',
          description:
            'Which item field to use as the row label. Default uses the first suitable field in the item schema.',
          default: '',
          oneOf: [{ const: '', title: 'default' }, ...paths],
        }
      : {
          type: 'string',
          title: 'elementLabelProp',
          description:
            'Dot path inside each item (e.g. name). Add fields in the row template first; then pick a field here.',
        }

  return {
    type: 'object',
    properties: {
      showSortButtons: {
        type: 'boolean',
        title: 'showSortButtons',
      },
      elementLabelProp: elementLabelPropSchema,
    },
  }
}

const uischemaScopeOverrides: ScopeOverrides | ((root: JsonSchema, selected: JsonSchema | null) => ScopeOverrides) = (
  _root,
  _selected
) =>
  ({
    '#/properties/elementLabelProp': {
      type: 'Control',
      scope: '#/properties/elementLabelProp',
      options: {
        dropdown: true,
      },
    } as ScopeOverrides[string],
  }) as ScopeOverrides

const mapWizardSchemaToToolData = (wizardSchema: JsonSchema | null, uiSchema: any) => {
  const root = wizardSchema ?? ({} as JsonSchema)
  const items = getResolvedItemsSchema(wizardSchema, root)
  const allowed = new Set(collectLabelPathOptions(items, root).map((o) => o.const))
  let elementLabelProp = normalizeElementLabelProp(uiSchema?.options?.elementLabelProp)
  if (allowed.size > 0 && elementLabelProp !== '' && !allowed.has(elementLabelProp)) {
    elementLabelProp = ''
  }

  return {
    showSortButtons: uiSchema?.options?.showSortButtons === true,
    elementLabelProp,
  }
}

const mapToolDataToWizardUischema = (toolData: any, wizardUiSchema: any, rootSchema: JsonSchema) => {
  const scope = wizardUiSchema?.scope as string | undefined
  const arraySchema =
    scope ? (resolveScopeWithoutRef(rootSchema, scope) as JsonSchema | null | undefined) : undefined
  const items = getResolvedItemsSchema(arraySchema ?? null, rootSchema)
  const allowed = new Set(collectLabelPathOptions(items, rootSchema).map((o) => o.const))
  let elementLabelProp = normalizeElementLabelProp(toolData?.elementLabelProp)
  if (allowed.size > 0 && elementLabelProp !== '' && !allowed.has(elementLabelProp)) {
    elementLabelProp = ''
  }

  const options: Record<string, unknown> = { ...(wizardUiSchema?.options ?? {}) }
  options.showSortButtons = toolData?.showSortButtons === true
  if (elementLabelProp !== '') {
    options.elementLabelProp = elementLabelProp
  } else {
    delete options.elementLabelProp
  }

  return {
    ...wizardUiSchema,
    options,
  }
}

const mapToolDataToWizardSchema = (_toolData: any, wizardSchema: JsonSchema | null, _rootSchema: JsonSchema) =>
  wizardSchema ?? ({} as JsonSchema)

const advancedListTester = rankWith(
  3,
  and(
    uiTypeIs('Control'),
    isObjectArray,
  )
)

export const AdvancedListToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema: (root, selected) => buildJsonSchemaForPanel(root, selected),
  uischemaScopeOverrides,
  tester: advancedListTester,
  toolSettingsMixins: [ToolsettingParts.Title, ToolsettingParts.Description],
}
