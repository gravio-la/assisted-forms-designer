import type { JsonSchema } from '@formswizard/types'
import type { RootState } from '@formswizard/state'

/** Payload shape accepted by `loadImportedSchema` — inverse of split `jsonFormsEdit` + definitions. */
export type RepairUndoPayload = {
  jsonSchema: JsonSchema
  uiSchema: unknown
  uiSchemas: Record<string, unknown>
}

/** Build a snapshot suitable for `loadImportedSchema` so the previous editor state can be restored after `repair_form`. */
export function buildRepairUndoPayload(getState: () => RootState): RepairUndoPayload {
  const edit = getState().jsonFormsEdit
  const dk = edit.definitionsKey
  const definitionsBlock = { Root: edit.jsonSchema, ...edit.definitions }
  return {
    jsonSchema: { [dk]: definitionsBlock } as JsonSchema,
    uiSchema: edit.uiSchema,
    uiSchemas: { ...edit.uiSchemas },
  }
}
