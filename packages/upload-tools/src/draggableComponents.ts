import { DraggableElement } from '@formswizard/types'

export const draggableComponents: DraggableElement[] = [
  {
    name: 'imageBlobUpload',
    category: 'advanced',
    ToolIconName: 'ImageUpload',
    jsonSchemaElement: {
      type: 'string',
      format: 'data-url',
    },
  },
]
