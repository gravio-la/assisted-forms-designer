import { ToolsettingParts } from '@formswizard/fieldsettings'
import type { JsonSchema, ToolSetting } from '@formswizard/types'
import { ALLOWED_IMAGE_MIME_TYPES } from './imageConstants'

const DEFAULT_MAX_BYTES = 512 * 1024

const jsonSchema: JsonSchema = {
  type: 'object',
  properties: {
    maxImageKiB: {
      type: 'number',
      title: 'maxImageKiB',
      default: 512,
    },
    allowedFormats: {
      type: 'array',
      title: 'allowedFormats',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: [...ALLOWED_IMAGE_MIME_TYPES],
      },
    },
  },
}

const allFormatsSortedKey = (formats: readonly string[]) =>
  [...formats].sort().join('\0')

const mapWizardSchemaToToolData = (_wizardSchema: JsonSchema | null, uiSchema: unknown) => {
  const opts =
    uiSchema && typeof uiSchema === 'object' && uiSchema !== null && 'options' in uiSchema
      ? (uiSchema as { options?: Record<string, unknown> }).options
      : undefined
  const maxBytes =
    opts && typeof opts.maxImageBytes === 'number' ? opts.maxImageBytes : DEFAULT_MAX_BYTES
  const maxImageKiB = Math.round(maxBytes / 1024)
  const raw = opts?.allowedFormats
  const allowedFormats =
    Array.isArray(raw) && raw.every((x) => typeof x === 'string') && raw.length > 0
      ? (raw as string[])
      : [...ALLOWED_IMAGE_MIME_TYPES]
  return { maxImageKiB, allowedFormats }
}

const mapToolDataToWizardSchema = (toolData: unknown, wizardSchema: JsonSchema | null) => {
  return { ...(wizardSchema ?? {}) } as JsonSchema
}

const mapToolDataToWizardUischema = (toolData: unknown, wizardUiSchema: unknown) => {
  const base =
    wizardUiSchema && typeof wizardUiSchema === 'object' && wizardUiSchema !== null
      ? { ...(wizardUiSchema as object) }
      : { type: 'Control' }

  const td = toolData as { maxImageKiB?: number; allowedFormats?: string[] }
  const maxImageKiB = typeof td.maxImageKiB === 'number' ? td.maxImageKiB : 512
  const maxImageBytes = maxImageKiB * 1024

  const all = [...ALLOWED_IMAGE_MIME_TYPES]
  const fmts =
    Array.isArray(td.allowedFormats) && td.allowedFormats.length > 0 ? td.allowedFormats : all

  const options: Record<string, unknown> = {
    ...((base as { options?: Record<string, unknown> }).options ?? {}),
  }

  if (maxImageBytes !== DEFAULT_MAX_BYTES) {
    options.maxImageBytes = maxImageBytes
  } else {
    delete options.maxImageBytes
  }

  if (allFormatsSortedKey(fmts) !== allFormatsSortedKey(all)) {
    options.allowedFormats = fmts
  } else {
    delete options.allowedFormats
  }

  const result: Record<string, unknown> = {
    ...base,
    options: Object.keys(options).length > 0 ? options : undefined,
  }

  if (!result.options) {
    delete result.options
  }

  return result
}

export const ImageBlobUploadToolSettings: ToolSetting = {
  mapWizardSchemaToToolData,
  mapToolDataToWizardSchema,
  mapToolDataToWizardUischema,
  jsonSchema,
  tester: (uiSchema, jsonSchema) =>
    uiSchema &&
    typeof uiSchema === 'object' &&
    (uiSchema as { type?: string }).type === 'Control' &&
    jsonSchema &&
    typeof jsonSchema === 'object' &&
    !Array.isArray(jsonSchema) &&
    (jsonSchema as { format?: string }).format === 'data-url'
      ? 10
      : 0,
  toolSettingsMixins: [ToolsettingParts.Title, ToolsettingParts.Description],
}
