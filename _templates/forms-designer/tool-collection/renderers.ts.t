---
to: packages/<%= name.split("/")[1] %>/src/renderers.ts
---
import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core'

/** Main canvas / preview JsonForms registry (`ToolProvider` → `rendererRegistry`). Add `JsonFormsRendererRegistryEntry` items here. */
export const renderers: JsonFormsRendererRegistryEntry[] = []
