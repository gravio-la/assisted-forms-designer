import React, { useCallback } from 'react'
import { Card, CardContent, CardHeader } from '@mui/material'
import ViewListIcon from '@mui/icons-material/ViewList'
import {
  ControlProps,
  JsonSchema,
  Layout,
  RankedTester,
  VerticalLayout,
  and,
  isObjectArrayWithNesting,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { useIcon } from '@formswizard/tool-context'
import { useAppDispatch, useAppSelector, selectPath, selectSelectedPath } from '@formswizard/state'
import { LayoutWithDropZoneRenderer } from './LayoutWithDropZoneRenderer'

const hasItemPropertiesScope = (uischema: ControlProps['uischema']): boolean =>
  uischema?.type === 'Control' && !!(uischema as { options?: { itemPropertiesScope?: string } }).options?.itemPropertiesScope

/**
 * Edit mode only (merged before default Material array renderers): droppable row template
 * for array-of-objects controls that set `options.itemPropertiesScope` + `options.detail`.
 *
 * Field settings: `AdvancedListToolSettings.ts` (see `designerRendererToolCollection`).
 */
export const materialEditableArrayListDetailTester: RankedTester = rankWith(
  8,
  and(
    uiTypeIs('Control'),
    (uischema, schema, context) =>
      isObjectArrayWithNesting(uischema, schema, context) && hasItemPropertiesScope(uischema)
  )
)

const ArrayListDetailInner = ({
  uischema,
  visible,
  enabled,
  path,
  schema,
  renderers,
  cells,
  label,
}: ControlProps) => {
  const dispatch = useAppDispatch()
  const selectedPath = useAppSelector(selectSelectedPath)
  const opt = (uischema as { options?: { detail?: Layout; iconName?: string } }).options
  const controlPath = (uischema as { path?: string }).path ?? ''
  const rawDetail = (opt?.detail ?? { type: 'VerticalLayout', elements: [] }) as VerticalLayout
  // LayoutWithDropZoneRenderer / useDropTarget require `path` in the uischema passed as `child`
  // so we attach the dot-path to this detail layout's position in the uiSchema tree.
  const detail = {
    ...rawDetail,
    path: controlPath ? `${controlPath}.options.detail` : 'options.detail',
  } as VerticalLayout & { path: string }
  const elements = detail.elements ?? []
  const CustomIcon = useIcon(opt?.iconName)

  const itemObjectSchema: JsonSchema =
    schema &&
    typeof schema === 'object' &&
    (schema as { type?: string }).type === 'array' &&
    (schema as { items?: JsonSchema }).items &&
    typeof (schema as { items: JsonSchema }).items === 'object'
      ? ((schema as { items: JsonSchema }).items as JsonSchema)
      : ({ type: 'object', properties: {} } as JsonSchema)

  const handleSelect = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      dispatch(selectPath((uischema as { path?: string }).path))
    },
    [dispatch, uischema]
  )

  if (!visible) {
    return null
  }

  const isSelected = selectedPath === (uischema as { path?: string }).path

  return (
    <Card
      onClick={handleSelect}
      sx={{
        marginBottom: 1,
        cursor: 'pointer',
        backgroundColor: (theme) => (isSelected ? theme.palette.action.selected : 'inherit'),
        '&:hover': {
          backgroundColor: (theme) => theme.palette.action.hover,
        },
      }}
    >
      <CardHeader
        avatar={CustomIcon ? <CustomIcon /> : <ViewListIcon color="action" />}
        title={typeof label === 'string' ? label : (uischema as { label?: string }).label ?? 'List'}
        subheader="Row fields (advanced list)"
      />
      <CardContent>
        <LayoutWithDropZoneRenderer
          uischema={detail}
          elements={elements}
          schema={itemObjectSchema}
          path={path}
          enabled={enabled}
          visible={visible}
          direction="column"
          renderers={renderers}
          cells={cells}
        />
      </CardContent>
    </Card>
  )
}

export const MaterialEditableArrayListDetailRenderer = withJsonFormsControlProps(ArrayListDetailInner)
