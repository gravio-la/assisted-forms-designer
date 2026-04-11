import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from 'react-redux'
import { useDesignerTranslation } from '@formswizard/i18n'
import type { JsonSchema } from '@formswizard/types'
import {
  useAppDispatch,
  useAppSelector,
  selectJsonSchema,
  selectUiSchema,
  selectUIElementFromSelection,
  isScopableUISchemaElement,
  aiAddField,
  aiAddLayout,
  aiRemoveElement,
  aiRemoveLayout,
  aiUpdateField,
  aiRenameField,
  aiMoveElement,
  aiUpdateLayout,
  loadImportedSchema,
  type RootState,
} from '@formswizard/state'
import { AiAssistantProvider, useAiAssistantChat } from '@graviola/agent-chat-flow'
import type { ToolResult } from '@graviola/agent-chat-flow'
import { WandHutFabIcon } from '@graviola/agent-chat-components'
import { AGENT_SESSION_CUSTOM_RENDERERS } from './agentSessionCustomRenderers'
import { buildRepairUndoPayload, type RepairUndoPayload } from './agentRepairUndoSnapshot'
import Fab from '@mui/material/Fab'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Button from '@mui/material/Button'

const SERVER_URL = import.meta.env.VITE_AGENT_SERVER_URL ?? 'http://localhost:3001'

function AssistantFABTrigger() {
  const { t } = useDesignerTranslation()
  const { openChat, isCreating, hasSession } = useAiAssistantChat()
  if (hasSession) return null
  return (
    <Fab
      color="primary"
      aria-label={t('aiAssistant.openFabAriaLabel')}
      onClick={() => void openChat()}
      disabled={isCreating}
      sx={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 1300,
        '& svg': { fontSize: 28 },
      }}
    >
      {isCreating ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        <WandHutFabIcon />
      )}
    </Fab>
  )
}

/**
 * Renders inside WizardProvider so it has access to the Redux store.
 * Wires the agent's client-side tool calls directly to Redux dispatch.
 * The schema is passed with every message so the server always builds
 * the system prompt from the current live state.
 */
export function AgentAssistant() {
  const { i18n } = useTranslation()
  const { t } = useDesignerTranslation()
  const sessionLanguage = useMemo((): 'de' | 'en' => (i18n.language.startsWith('de') ? 'de' : 'en'), [
    i18n.language,
  ])

  const welcomeMessage = t('aiAssistant.welcome')

  const dispatch = useAppDispatch()
  const store = useStore<RootState>()
  const jsonSchema = useAppSelector(selectJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const selectedElement = useAppSelector(selectUIElementFromSelection)

  const repairUndoRef = useRef<RepairUndoPayload | null>(null)
  const [repairUndoSnackbarOpen, setRepairUndoSnackbarOpen] = useState(false)
  const [repairUndoneSnackbarOpen, setRepairUndoneSnackbarOpen] = useState(false)

  const handleDismissRepairUndo = useCallback(() => {
    setRepairUndoSnackbarOpen(false)
    repairUndoRef.current = null
  }, [])

  const handleUndoRepair = useCallback(() => {
    const snapshot = repairUndoRef.current
    if (!snapshot) return
    dispatch(loadImportedSchema(snapshot))
    repairUndoRef.current = null
    setRepairUndoSnackbarOpen(false)
    setRepairUndoneSnackbarOpen(true)
  }, [dispatch])

  const agentSelectedElement = selectedElement
    ? {
        type: selectedElement.type,
        ...(isScopableUISchemaElement(selectedElement) ? { scope: (selectedElement as any).scope } : {}),
        ...('label' in selectedElement && selectedElement.label
          ? { label: selectedElement.label as string }
          : {}),
      }
    : undefined

  const handleExecuteTool = useCallback(
    (toolName: string, args: Record<string, unknown>): ToolResult => {
      try {
        switch (toolName) {
          case 'replace_form':
          case 'repair_form': {
            const jsonSchemaArg = args['jsonSchema']
            const uiSchemaArg = args['uiSchema']
            if (jsonSchemaArg == null || typeof jsonSchemaArg !== 'object' || Array.isArray(jsonSchemaArg)) {
              return { success: false, error: 'replace_form/repair_form: jsonSchema must be an object' }
            }
            if (uiSchemaArg == null || typeof uiSchemaArg !== 'object' || Array.isArray(uiSchemaArg)) {
              return { success: false, error: 'replace_form/repair_form: uiSchema must be an object' }
            }
            if (toolName === 'repair_form') {
              repairUndoRef.current = buildRepairUndoPayload(() => store.getState())
            } else {
              repairUndoRef.current = null
              setRepairUndoSnackbarOpen(false)
            }
            dispatch(
              loadImportedSchema({
                jsonSchema: jsonSchemaArg as JsonSchema,
                uiSchema: uiSchemaArg,
              }),
            )
            if (toolName === 'repair_form') {
              setRepairUndoSnackbarOpen(true)
            }
            return {
              success: true,
              message: toolName === 'repair_form' ? 'Form repaired.' : 'Form replaced.',
            }
          }
          case 'add_field':
            dispatch(aiAddField(args as any))
            break
          case 'add_layout':
            dispatch(aiAddLayout(args as any))
            break
          case 'remove_element':
            dispatch(aiRemoveElement(args as any))
            break
          case 'remove_layout':
            dispatch(aiRemoveLayout(args as { path: string }))
            break
          case 'update_field':
            dispatch(aiUpdateField(args as any))
            break
          case 'rename_field':
            dispatch(aiRenameField(args as any))
            break
          case 'move_element':
            dispatch(aiMoveElement(args as any))
            break
          case 'update_layout':
            dispatch(aiUpdateLayout(args as any))
            break
          default:
            return { success: false, error: `Unknown tool: ${toolName}` }
        }
        return { success: true, message: `Applied ${toolName} successfully.` }
      } catch (err) {
        return { success: false, error: String(err) }
      }
    },
    [dispatch, store],
  )

  return (
    <>
      <AiAssistantProvider
        serverUrl={SERVER_URL}
        language={sessionLanguage}
        welcomeMessage={welcomeMessage}
        customRenderers={AGENT_SESSION_CUSTOM_RENDERERS}
        schema={{ jsonSchema, uiSchema }}
        onExecuteTool={handleExecuteTool}
        {...(agentSelectedElement !== undefined ? { selectedElement: agentSelectedElement } : {})}
      >
        <AssistantFABTrigger />
      </AiAssistantProvider>
      <Snackbar
        open={repairUndoSnackbarOpen}
        onClose={handleDismissRepairUndo}
        message={t('aiAssistant.repairUndoMessage')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 88, sm: 100 } }}
        action={
          <Button color="inherit" size="small" onClick={handleUndoRepair}>
            {t('aiAssistant.repairUndoAction')}
          </Button>
        }
      />
      <Snackbar
        open={repairUndoneSnackbarOpen}
        autoHideDuration={4000}
        onClose={() => setRepairUndoneSnackbarOpen(false)}
        message={t('aiAssistant.repairUndone')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 88, sm: 100 } }}
      />
    </>
  )
}
