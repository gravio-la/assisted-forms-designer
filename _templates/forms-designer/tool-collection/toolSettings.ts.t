---
to: packages/<%= name.split("/")[1] %>/src/toolSettings.ts
---
import type { ToolSettings } from '@formswizard/types'

/** `ToolSetting` entries (`packages/types`) for the field-settings panel — one per control/layout that exposes options. */
export const toolSettings: ToolSettings = []
