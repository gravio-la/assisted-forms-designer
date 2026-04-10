import type { Format } from 'ajv'
import { materialCells } from '@jsonforms/material-renderers'
import type { FormsDesignerToolCollection } from '@formswizard/types'
import { imageBlobUploadRendererEntry } from '@formswizard/upload-tools'
import { toplevelLayoutRendererEntry } from './ToplevelLayoutRenderer'
import { ToplevelLayoutToolSettings } from './ToplevelLayoutToolSettings'
import { fontFamilyControlEntry } from './FontFamilyControl'
import { translations } from './translations'

/** TopLevel tool-settings schema uses `format: data-url` for the header image — register for FieldSettingsView AJV. */
const dataUrlFormat: Format = (data: string) =>
  typeof data === 'string' && data.length > 0 && data.startsWith('data:')

export const toplevelLayoutCollection: FormsDesignerToolCollection = {
  info: {
    name: 'toplevel-layout',
    description: 'Card-style top layout with hero image, headline, and color themes',
    categories: ['layout'],
  },
  rendererRegistry: [toplevelLayoutRendererEntry],
  settingsRendererRegistry: [imageBlobUploadRendererEntry, fontFamilyControlEntry],
  cellRendererRegistry: materialCells,
  toolSettings: [ToplevelLayoutToolSettings],
  ajvFormatRegistry: {
    'data-url': dataUrlFormat,
  },
  translations,
}
