import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core'
import {
  MaterialTextControlDesigner,
  basicRenderer,
  materialTextControlDesignerTester,
} from '@formswizard/designer-basic-renderer'
import { materialRenderers } from '@jsonforms/material-renderers'

export const renderers: JsonFormsRendererRegistryEntry[] = [
  { tester: materialTextControlDesignerTester, renderer: MaterialTextControlDesigner },
  ...materialRenderers,
  ...basicRenderer,
]
