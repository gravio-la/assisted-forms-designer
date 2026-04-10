import type { FormsDesignerToolCollection } from '@formswizard/types'
import { draggableComponents } from './draggableComponents'
import { icons } from './icons'
import { renderers } from './renderers'
import { toolSettings } from './toolSettings'
import { translations } from './translations'

export const uploadToolsCollection: FormsDesignerToolCollection = {
  info: {
    name: 'upload-tools',
    description: 'Upload controls (image blob, future server-backed)',
    categories: ['advanced', 'upload'],
  },
  draggableElements: draggableComponents,
  iconRegistry: icons,
  rendererRegistry: renderers,
  toolSettings,
  translations,
}
