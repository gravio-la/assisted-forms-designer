import type { Meta, StoryObj } from '@storybook/react'
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import type { JsonSchema } from '@jsonforms/core'
import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { COLOR_THEME_IDS, type ColorThemeId } from './colorThemes'
import { toplevelLayoutRendererEntry } from './ToplevelLayoutRenderer'

const demoSchema: JsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Your name',
    },
  },
  required: ['name'],
}

const verticalWithName = {
  type: 'VerticalLayout' as const,
  elements: [{ type: 'Control' as const, scope: '#/properties/name' }],
}

const renderers = [...materialRenderers, toplevelLayoutRendererEntry]

function JsonFormsStateBridge({
  schema,
  uischema,
}: {
  schema: JsonSchema
  uischema: unknown
}) {
  const [data, setData] = useState<Record<string, unknown>>({})
  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      renderers={renderers}
      cells={materialCells}
      onChange={({ data }) => setData(data ?? {})}
    />
  )
}

const meta = {
  title: 'toplevel-layout/ToplevelLayoutRenderer',
  component: JsonFormsStateBridge,
} satisfies Meta<typeof JsonFormsStateBridge>

export default meta

type Story = StoryObj<typeof JsonFormsStateBridge>

export const Default: Story = {
  args: {
    schema: demoSchema,
    uischema: {
      type: 'TopLevelLayout',
      elements: [verticalWithName],
      options: {
        headline: 'Activity Feedback (demo)',
        description:
          'Thank you for participating in this activity. Please share with us your impression.',
        colorTheme: 'lavender',
      },
    },
  },
}

const tinySvg = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="48"><rect fill="#7b1fa2" width="120" height="48"/><text x="8" y="30" fill="white" font-size="14">Hero</text></svg>'
)}`

export const WithHeroImage: Story = {
  args: {
    schema: demoSchema,
    uischema: {
      type: 'TopLevelLayout',
      elements: [verticalWithName],
      options: {
        headline: 'Activity Feedback (demo)',
        description: 'Card with a small inline SVG hero image.',
        colorTheme: 'lavender',
        image: tinySvg,
      },
    },
  },
}

export function AllThemes() {
  return (
    <Stack spacing={4} sx={{ p: 2 }}>
      {COLOR_THEME_IDS.filter((id) => id !== 'default').map((theme: ColorThemeId) => (
        <Box key={theme}>
          <Typography variant="subtitle2" gutterBottom>
            Theme: {theme}
          </Typography>
          <JsonFormsStateBridge
            schema={demoSchema}
            uischema={{
              type: 'TopLevelLayout',
              elements: [verticalWithName],
              options: {
                headline: `${theme} theme`,
                colorTheme: theme,
              },
            }}
          />
        </Box>
      ))}
    </Stack>
  )
}
