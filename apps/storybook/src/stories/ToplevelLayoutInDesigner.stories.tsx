import type { Meta, StoryObj } from '@storybook/react'
import { ToolProvider } from '@formswizard/tool-context'
import { WizardProvider, MainLayout } from '@formswizard/forms-designer'
import { I18nProvider } from '@formswizard/i18n'
import { basicToolsCollection } from '@formswizard/basic-tools'
import { designerRendererToolCollection } from '@formswizard/designer-renderer'
import { advancedToolsCollection } from '@formswizard/advanced-tools'
import { toplevelLayoutCollection } from '@formswizard/toplevel-layout'

/**
 * Full designer shell with toplevel-layout registered — lives in storybook to avoid a
 * workspace cycle (forms-designer → toplevel-layout → forms-designer).
 */
const meta = {
  title: 'toplevel-layout/InDesigner',
  component: MainLayout,
} satisfies Meta<typeof MainLayout>

export default meta

export const WithToplevelCollection: StoryObj<typeof MainLayout> = {
  render: () => (
    <I18nProvider>
      <ToolProvider
        toolCollections={[
          basicToolsCollection,
          designerRendererToolCollection,
          advancedToolsCollection,
          toplevelLayoutCollection,
        ]}
      >
        <WizardProvider>
          <MainLayout multipleDefinitions={false} />
        </WizardProvider>
      </ToolProvider>
    </I18nProvider>
  ),
}
