import { JsonSchema } from '@formswizard/types'
import { DEFAULT_ROOT_UI_SCHEMA } from './defaultRootUiSchema'
export type JsonFormsEditState = {
  jsonSchema: JsonSchema
  definitions: Record<string, JsonSchema>
  uiSchema?: any
  // selectedElementKey?: string | null
  selectedPath?: string
  uiSchemas: Record<string, any>
  selectedDefinition: string,
  definitionsKey: "definitions" | "$defs"
}

export const exampleBaseIRI = "http://forms-designer.winzlieb.eu/example#"
const typeNameToTypeIRI = (typeName: string) => `${exampleBaseIRI}${typeName}`

export const exampleInitialState: JsonFormsEditState = {
  jsonSchema: {
    type: 'object',
    properties: {}
  },
  uiSchema: DEFAULT_ROOT_UI_SCHEMA,
  definitions: {},
  uiSchemas: {},
  selectedDefinition: 'Root',
  definitionsKey: "definitions"
}
