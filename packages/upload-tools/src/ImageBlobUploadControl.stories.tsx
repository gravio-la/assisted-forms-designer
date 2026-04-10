import type { Meta, StoryObj } from '@storybook/react'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import type { JsonSchema } from '@jsonforms/core'
import { useState } from 'react'
import { Typography } from '@mui/material'
import { imageBlobUploadRendererEntry } from './ImageBlobUploadControl'

const imageSchema: JsonSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      title: 'Header image',
      format: 'data-url',
      description: 'JPEG, PNG, WebP, or SVG — stored as data URL.',
    },
  },
}

const renderers = [...materialRenderers, imageBlobUploadRendererEntry]

function ImageFieldStory({
  initialData,
  maxImageBytes,
}: {
  initialData?: Record<string, unknown>
  maxImageBytes?: number
}) {
  const [data, setData] = useState<Record<string, unknown>>(initialData ?? { image: undefined })
  return (
    <JsonForms
      schema={imageSchema}
      uischema={{
        type: 'Control',
        scope: '#/properties/image',
        ...(maxImageBytes !== undefined
          ? { options: { maxImageBytes } }
          : {}),
      }}
      data={data}
      renderers={renderers}
      cells={materialCells}
      onChange={({ data }) => setData(data ?? {})}
    />
  )
}

const meta = {
  title: 'upload-tools/ImageBlobUploadControl',
  component: ImageFieldStory,
} satisfies Meta<typeof ImageFieldStory>

export default meta

type Story = StoryObj<typeof ImageFieldStory>

export const Empty: Story = {
  args: {},
}

const tinySvgDataUrl = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="teal"/></svg>'
)}`

export const WithPreview: Story = {
  args: {
    initialData: { image: tinySvgDataUrl },
  },
}

/** Almost any real image file exceeds 8 bytes — use to verify client-side size validation. */
export const TightSizeLimit: Story = {
  render: () => (
    <>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        Max 8 bytes — choosing a file should show &quot;File too large&quot;.
      </Typography>
      <ImageFieldStory maxImageBytes={8} />
    </>
  ),
}
