'use client'

import { useEffect, useState } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import NoteAdd from '@mui/icons-material/NoteAdd'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import Brightness7 from '@mui/icons-material/Brightness7'
import Brightness4 from '@mui/icons-material/Brightness4'
import {
  useAppDispatch,
  useAppSelector,
  toggleColorMode,
  selectPreviewModus,
  resetWizard,
  clearPersistedJsonFormsEditState,
} from '@formswizard/state'
import { useFinalizedToolSettings } from '@formswizard/fieldsettings'
import { useDesignerTranslation } from '@formswizard/i18n'
import { i18nInstance } from '@formswizard/i18n'
import { alpha, useTheme } from '@mui/material/styles'
import { PreviewModeToggle } from './MainAppBar'
import { ExportSchemaModal, ImportSchemaModal } from '../components'

export interface MobileAppBarProps {
  leftDrawerOpen: boolean
  onToggleLeftDrawer: () => void
  rightDrawerOpen: boolean
  onToggleRightDrawer: () => void
}

export function MobileAppBar({
  leftDrawerOpen,
  onToggleLeftDrawer,
  rightDrawerOpen,
  onToggleRightDrawer,
}: MobileAppBarProps) {
  const { t } = useDesignerTranslation()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const previewModus = useAppSelector(selectPreviewModus)
  const { selectedPath } = useFinalizedToolSettings()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  /** Bumps when selection changes so the settings button attention animation restarts. */
  const [settingsAttentionKey, setSettingsAttentionKey] = useState(0)

  const showLeftDrawerToggle = !previewModus
  /** Root layout uses `path: ''` from extendUiSchemaWithPath — must not use Boolean(path) (falsy for ''). */
  const showRightDrawerToggle = selectedPath != null && !previewModus

  useEffect(() => {
    if (selectedPath != null && !previewModus) {
      setSettingsAttentionKey((k) => k + 1)
    }
  }, [selectedPath, previewModus])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleResetForm = () => {
    handleMenuClose()
    if (window.confirm(t('appBar.resetConfirm'))) {
      clearPersistedJsonFormsEditState()
      dispatch(resetWizard())
    }
  }

  const handleExportClick = () => {
    handleMenuClose()
    setExportModalOpen(true)
  }

  const handleImportClick = () => {
    handleMenuClose()
    setImportModalOpen(true)
  }

  const handleDarkModeToggle = () => {
    dispatch(toggleColorMode())
  }

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', minHeight: { xs: 48 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 48 }}>
            {showLeftDrawerToggle && (
              <IconButton
                color="inherit"
                aria-label={t('appBar.toolbox')}
                onClick={onToggleLeftDrawer}
                edge="start"
              >
                <BuildCircleOutlinedIcon />
              </IconButton>
            )}
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <PreviewModeToggle />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 48, justifyContent: 'flex-end' }}>
            {showRightDrawerToggle && (
              <Box
                key={settingsAttentionKey}
                sx={(theme) => ({
                  display: 'inline-flex',
                  borderRadius: '50%',
                  '@keyframes mobileSettingsAttention': {
                    '0%': {
                      transform: 'scale(1)',
                      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.55)}`,
                    },
                    '32%': {
                      transform: 'scale(1.14)',
                      boxShadow: `0 0 0 14px ${alpha(theme.palette.primary.main, 0)}`,
                    },
                    '58%': {
                      transform: 'scale(1)',
                      boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}`,
                    },
                    '76%': {
                      transform: 'scale(1.08)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                    },
                  },
                  animation: 'mobileSettingsAttention 2.1s ease-out 1',
                  '@media (prefers-reduced-motion: reduce)': {
                    animation: 'none',
                  },
                })}
              >
                <IconButton
                  color="inherit"
                  aria-label={t('appBar.settings')}
                  onClick={onToggleRightDrawer}
                >
                  <SettingsIcon />
                </IconButton>
              </Box>
            )}
            <IconButton
              color="inherit"
              aria-label={t('appBar.menu')}
              onClick={handleMenuOpen}
              edge="end"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220 } } }}
      >
        <MenuItem onClick={handleResetForm}>
          <ListItemIcon>
            <NoteAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('appBar.newForm')} />
        </MenuItem>
        <MenuItem onClick={handleExportClick}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('appBar.exportSchema')} />
        </MenuItem>
        <MenuItem onClick={handleImportClick}>
          <ListItemIcon>
            <FileUploadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('appBar.importSchema')} />
        </MenuItem>
        <Divider />
        <MenuItem disabled sx={{ opacity: 1 }}>
          <ListItemText primary={t('appBar.language')} secondary={i18nInstance.language.toUpperCase()} />
        </MenuItem>
        <MenuItem onClick={() => { i18nInstance.changeLanguage('en'); handleMenuClose(); }}>
          <ListItemText primary="EN" />
        </MenuItem>
        <MenuItem onClick={() => { i18nInstance.changeLanguage('de'); handleMenuClose(); }}>
          <ListItemText primary="DE" />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleDarkModeToggle}
          disableRipple
          sx={{ gap: 1 }}
        >
          <ListItemIcon>
            {theme.palette.mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={t('appBar.darkMode')} />
          <Switch
            size="small"
            checked={theme.palette.mode === 'dark'}
            onChange={handleDarkModeToggle}
            onClick={(e) => e.stopPropagation()}
          />
        </MenuItem>
      </Menu>

      <ExportSchemaModal open={exportModalOpen} onClose={() => setExportModalOpen(false)} />
      <ImportSchemaModal open={importModalOpen} onClose={() => setImportModalOpen(false)} />
    </>
  )
}
