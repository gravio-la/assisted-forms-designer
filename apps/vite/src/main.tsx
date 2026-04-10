import '@fontsource/cormorant-garamond'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/playfair-display'
import '@fontsource/playfair-display/700.css'
import '@fontsource/special-elite'
import './fonts.css'
import { createRoot } from 'react-dom/client'
import { WizardProvider, MainLayout } from '@formswizard/forms-designer'
import { ToolProvider } from '@formswizard/tool-context'
import { I18nProvider } from '@formswizard/i18n'
import { basicToolsCollection } from '@formswizard/basic-tools'
import { advancedToolsCollection } from '@formswizard/advanced-tools'
import { AvailableFontsProvider, toplevelLayoutCollection } from '@formswizard/toplevel-layout'
import { uploadToolsCollection } from '@formswizard/upload-tools'
import { MarkdownChatProvider } from '@graviola/agent-chat-markdown'
import { AgentAssistant } from './AgentAssistant'
import type { FontDefinition } from '@formswizard/toplevel-layout'

const AVAILABLE_FONTS: FontDefinition[] = [
  {
    id: 'playfair-display',
    label: 'Playfair Display',
    fontFamily: '"Playfair Display", "Georgia", serif',
  },
  {
    id: 'special-elite',
    label: 'Special Elite',
    fontFamily: '"Special Elite", "Courier New", monospace',
  },
  {
    id: 'baar-philos',
    label: 'BaarPhilos',
    fontFamily: '"BaarPhilos", "Georgia", serif',
  },
  {
    id: 'cormorant-garamond',
    label: 'Cormorant Garamond',
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
  },
]

const App = () => (
  <AvailableFontsProvider fonts={AVAILABLE_FONTS}>
  <I18nProvider>
    <ToolProvider
      toolCollections={[
        basicToolsCollection,
        advancedToolsCollection,
        toplevelLayoutCollection,
        uploadToolsCollection,
      ]}
    >
      <WizardProvider>
        <MarkdownChatProvider>
          <MainLayout multipleDefinitions={false} />
          <AgentAssistant />
        </MarkdownChatProvider>
      </WizardProvider>
    </ToolProvider>
  </I18nProvider>
  </AvailableFontsProvider>
)

const container = document.getElementById('app') as HTMLElement
const root = createRoot(container)
root.render(<App />)
