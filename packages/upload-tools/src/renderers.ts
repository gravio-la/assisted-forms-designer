import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core'
import { imageBlobUploadRendererEntry } from './ImageBlobUploadControl'

/** Main JsonForms registry (wizard canvas + preview). Field-settings panels use `settingsRendererRegistry` separately. */
export const renderers: JsonFormsRendererRegistryEntry[] = [imageBlobUploadRendererEntry]
