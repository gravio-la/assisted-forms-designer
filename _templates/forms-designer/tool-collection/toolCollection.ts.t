---
to: packages/<%= name.split("/")[1] %>/src/toolCollection.ts
---
import type { FormsDesignerToolCollection } from '@formswizard/types'
import { draggableComponents } from './draggableComponents'
import { icons } from './icons'
import { renderers } from './renderers'
import { toolSettings } from './toolSettings'
import { translations } from './translations'

/**
 * `FormsDesignerToolCollection` — bundle of registries and metadata registered with `ToolProvider` (`packages/tool-context`).
 *
 * `ToolProvider` **merges** every field below from each collection in `toolCollections` **in array order** (later collections append; `ajvFormatRegistry` and `iconRegistry` shallow-merge by key). The merged result is exposed via `useToolContext()` and drives the toolbox, the main designer canvas, and the field-settings drawer.
 *
 * ---
 *
 * ### `info` (required)
 * - **`name`**: Stable id for this collection. Used as the **i18next namespace** when `translations` are registered (`addTranslations(info.name, …)`), and listed in `registeredCollections` for JsonForms i18n resolution.
 * - **`description`**, **`categories`**: Toolbox / UI metadata.
 *
 * ### `rendererRegistry`
 * **Where it runs:** the **main designer / preview** `<JsonForms>` (see `packages/forms-designer/Wizard.tsx` → `usePreparedJsonFormsState`).
 *
 * **Merge order in the canvas:** `[ …merged collection renderers… , …drop-zone / edit chrome… , …preview-only… ]` (exact slices depend on edit vs preview mode).
 *
 * This is the registry for **controls and layouts that must paint on the designed form** (the WYSIWYG surface). Typical stacks include `@jsonforms/material-renderers` **plus** your custom `JsonFormsRendererRegistryEntry[]` (tester + React renderer). If a custom field only lives here, it appears on the canvas but **not** automatically in the field-settings JsonForms instance (see `settingsRendererRegistry`).
 *
 * ### `settingsRendererRegistry` (optional; not in this scaffold by default)
 * **Where it runs:** **only** the field-settings panel `<JsonForms>` (`packages/fieldSettings/FieldSettingsView.tsx`).
 *
 * **Merge order:** `[ …materialRenderers… , …settingsRendererRegistry… ]`.
 *
 * Use this for renderers that are **only** needed when editing tool-metadata / field options JSON Schemas in the right drawer (e.g. a specialized control that should not be part of the main canvas list). If the **same** renderer must work in **both** the designed form and the settings form (common for image upload, custom inputs), register the **same** `JsonFormsRendererRegistryEntry` in **both** `rendererRegistry` and `settingsRendererRegistry` — they are separate lists.
 *
 * ### `cellRendererRegistry` (optional)
 * **Where it runs:** main canvas JsonForms **cells** (`usePreparedJsonFormsState` → `cells`), merged in order with collections. Often set to `materialCells` from `@jsonforms/material-renderers` in a “base” collection (e.g. `basic-tools`); override or extend when you ship custom cells.
 *
 * ### `toolSettings`
 * Array of `ToolSetting` definitions (`packages/types`): JSON Schemas + mappers + testers that power the **field settings** UI when a canvas element matches. Empty array is valid for layout-only collections.
 *
 * ### `ajvFormatRegistry` (optional)
 * Custom **AJV** `format` validators (e.g. `data-url`), merged into both the **main** JsonForms AJV instance and **`useToolSettingsAjv()`** for the settings panel. Declare formats referenced by your tool-settings or main schema.
 *
 * ### `translations` (optional)
 * Per-language string maps keyed by JsonForms i18n keys. Namespace on the wire is **`info.name`** (e.g. `<%= name.split("/")[1] %>`). Consumed through `useJsonFormsI18n(registeredCollections)` and schema `i18n` prefixes on properties.
 *
 * ### `iconRegistry` / `draggableElements`
 * Toolbox icons and draggable palette entries; merged by name / appended respectively.
 *
 * ---
 *
 * **After scaffolding:** import this export in your app’s `ToolProvider` (`toolCollections={[ …, <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection ]}`), run `bun install`, and build. See the repo root `README.md` section *Tool collections*.
 *
 * @see `FormsDesignerToolCollection` in `packages/types`
 */
export const <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection: FormsDesignerToolCollection = {
  info: {
    name: '<%= name.split("/")[1] %>',
    description: '<%= description %>',
    categories: [],
  },
  draggableElements: draggableComponents,
  iconRegistry: icons,
  rendererRegistry: renderers,
  toolSettings,
  translations,
}
