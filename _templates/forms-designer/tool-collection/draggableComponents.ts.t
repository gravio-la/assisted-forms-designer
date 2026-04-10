---
to: packages/<%= name.split("/")[1] %>/src/draggableComponents.ts
---
import type { DraggableElement } from '@formswizard/types'

/** Toolbox entries (palette). Prefer `jsonSchemaElement` + optional `uiSchema` per `DraggableElement`. */
export const draggableComponents: DraggableElement[] = []
