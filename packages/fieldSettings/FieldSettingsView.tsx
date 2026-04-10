import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import type { JsonSchema as JsonFormsJsonSchema } from '@jsonforms/core'
import { useMemo } from 'react'
import { useFinalizedToolSettings } from './useFieldSettings'
import { Box, Divider, Grid } from '@mui/material'
import { useToolContext, useToolSettingsAjv } from '@formswizard/tool-context'
import { useJsonFormsI18n } from '@formswizard/i18n'
import EditableFieldKeyDisplay from './EditableFieldKeyDisplay'

export function FieldSettingsView() {
  const { handleChange, toolSettingsJsonSchema, tooldataBuffer, uiSchema } = useFinalizedToolSettings()
  const { registeredCollections, settingsRendererRegistry } = useToolContext()
  const renderers = useMemo(
    () => [...materialRenderers, ...(settingsRendererRegistry ?? [])],
    [settingsRendererRegistry]
  )
  const i18n = useJsonFormsI18n(registeredCollections)
  const ajv = useToolSettingsAjv()

  return (
    <>
      <Box sx={{ px: 1.5, py: 1 }}>
        <EditableFieldKeyDisplay />
      </Box>
      <Divider />
      <Grid container direction={'column'} spacing={2} sx={{ p: 2 }}>
        <Grid>
          <Box>
            {!!toolSettingsJsonSchema && !!tooldataBuffer && (
              <JsonForms
                data={tooldataBuffer}
                schema={toolSettingsJsonSchema as JsonFormsJsonSchema}
                uischema={uiSchema || undefined}
                renderers={renderers}
                cells={materialCells}
                onChange={handleChange}
                i18n={i18n}
                ajv={ajv}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
