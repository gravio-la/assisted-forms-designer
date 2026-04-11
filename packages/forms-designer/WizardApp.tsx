'use client'

import { ToolProvider } from '@formswizard/tool-context'
import { MainLayout } from './MainLayout'
import { WizardProvider } from './WizardProvider'
import { basicToolsCollection } from '@formswizard/basic-tools'
import { designerRendererToolCollection } from '@formswizard/designer-renderer'
import { advancedToolsCollection } from '@formswizard/advanced-tools'
import { toplevelLayoutCollection } from '@formswizard/toplevel-layout'
import { uploadToolsCollection } from '@formswizard/upload-tools'

export function WizardApp() {
  return (
    <ToolProvider
      toolCollections={[
        basicToolsCollection,
        designerRendererToolCollection,
        advancedToolsCollection,
        uploadToolsCollection,
        toplevelLayoutCollection,
      ]}
    >
      <WizardProvider>
        <MainLayout
          multipleDefinitions={false}
        />
      </WizardProvider>
    </ToolProvider>
  )
}