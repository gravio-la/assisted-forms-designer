import {
  LayoutProps,
  OwnPropsOfLayout,
  RankedTester,
  UISchemaElement,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core'
import { withJsonFormsLayoutProps } from '@jsonforms/react'
import {
  TopLevelLayoutRendererShell,
  type TopLevelLayoutUISchema,
} from '@formswizard/toplevel-layout'

import { LayoutWithDropZoneRenderer, MaterialLayoutRendererProps } from './LayoutWithDropZoneRenderer'

export const TopLevelLayoutWithDropZoneRenderer = (props: LayoutProps) => {
  const { uischema, schema, path, enabled, visible, renderers, cells } = props
  const layout = uischema as TopLevelLayoutUISchema & { path?: string }

  const childProps: MaterialLayoutRendererProps = {
    elements: layout.elements ?? [],
    schema,
    path,
    enabled,
    direction: 'column',
    visible,
    uischema: uischema as UISchemaElement,
  }

  return (
    <TopLevelLayoutRendererShell
      {...props}
      renderBody={() => (
        <LayoutWithDropZoneRenderer {...childProps} renderers={renderers} cells={cells} />
      )}
    />
  )
}

const TopLevelLayoutWithDropZoneRendererWithProps:
  | React.ComponentClass<LayoutProps & OwnPropsOfLayout>
  | React.FunctionComponent<LayoutProps & OwnPropsOfLayout> = withJsonFormsLayoutProps(
  TopLevelLayoutWithDropZoneRenderer
)

export default TopLevelLayoutWithDropZoneRendererWithProps

export const topLevelLayoutWithDropZoneTester: RankedTester = rankWith(10, uiTypeIs('TopLevelLayout'))
