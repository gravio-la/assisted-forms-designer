import {
  TopLevelLayoutWithDropZoneRenderer,
  topLevelLayoutWithDropZoneTester,
} from './TopLevelLayoutWithDropZoneRenderer'
import { verticalLayoutTester, VerticalLayoutWithDropZoneRenderer } from './VerticalLayoutWithDropZoneRenderer'
import { horizontalLayoutTester, HorizontalLayoutWithDropZoneRenderer } from './HorizontalLayoutWithDropZoneRenderer'
import { materialEditableGroupTester, MaterialEditableGroupLayoutRenderer } from './MaterialEditableGroupLayout'
import { categorizationEditableTester, MaterialEditableCategorizationLayoutRenderer } from './MaterialEditableCategorizationLayout'
import {
  categorizationPreviewTester,
  MaterialPreviewCategorizationLayoutRenderer,
} from './MaterialEditableCategorizationLayout'
import {
  materialEditableArrayListDetailTester,
  MaterialEditableArrayListDetailRenderer,
} from './MaterialEditableArrayListDetail'

export { AdvancedListToolSettings, collectLabelPathOptions } from './AdvancedListToolSettings'
export { designerRendererToolCollection } from './designerRendererToolCollection'
export { advancedListToolTranslations } from './advancedListToolTranslations'

export * from './HorizontalLayoutWithDropZoneRenderer'
export * from './TopLevelLayoutWithDropZoneRenderer'
export * from './VerticalLayoutWithDropZoneRenderer'
export * from './MaterialEditableCategorizationLayout'

export const previewRenderer = [
  {
    tester: categorizationPreviewTester,
    renderer: MaterialPreviewCategorizationLayoutRenderer,
  },
]

export const dropRenderer = [
  {
    tester: topLevelLayoutWithDropZoneTester,
    renderer: TopLevelLayoutWithDropZoneRenderer,
  },
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayoutWithDropZoneRenderer,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayoutWithDropZoneRenderer,
  },
  {
    tester: materialEditableGroupTester,
    renderer: MaterialEditableGroupLayoutRenderer,
  },
  {
    tester: categorizationEditableTester,
    renderer: MaterialEditableCategorizationLayoutRenderer,
  },
  {
    tester: materialEditableArrayListDetailTester,
    renderer: MaterialEditableArrayListDetailRenderer,
  },
]
