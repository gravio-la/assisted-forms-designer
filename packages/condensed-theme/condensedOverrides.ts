import { createTheme } from '@mui/material/styles'
import type { Components, Theme, ThemeOptions } from '@mui/material/styles'

export const condensedComponentOverrides: Components<Omit<Theme, 'components'>> = {
  // ── Inputs ──────────────────────────────────────
  MuiTextField: {
    defaultProps: { size: 'small', margin: 'dense' },
  },
  MuiOutlinedInput: {
    defaultProps: { margin: 'dense' },
    styleOverrides: {
      root: { borderRadius: 6, fontSize: '0.875rem' },
      input: { padding: '8px 12px' },
      inputSizeSmall: { padding: '6px 10px' },
    },
  },
  MuiFilledInput: { defaultProps: { margin: 'dense' } },
  MuiInputBase: { defaultProps: { margin: 'dense' } },
  MuiInputLabel: {
    defaultProps: { size: 'small' },
    styleOverrides: { root: { fontSize: '0.875rem' } },
  },
  MuiFormControl: { defaultProps: { margin: 'dense' } },
  MuiFormHelperText: { defaultProps: { margin: 'dense' } },
  MuiSelect: { defaultProps: { size: 'small' } },
  MuiAutocomplete: {
    defaultProps: { size: 'small' },
    styleOverrides: {
      option: { fontSize: '0.875rem', minHeight: 32, padding: '4px 12px' },
      listbox: { padding: '4px 0' },
    },
  },

  // ── Buttons ─────────────────────────────────────
  MuiButton: {
    defaultProps: { size: 'small', disableElevation: true },
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        borderRadius: 6,
        letterSpacing: 0,
      },
      sizeSmall: { padding: '6px 12px', fontSize: '0.8125rem' },
      contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
    },
  },
  MuiIconButton: { defaultProps: { size: 'small' } },
  MuiFab: { defaultProps: { size: 'small' } },
  MuiToggleButton: { defaultProps: { size: 'small' } },

  // ── Selection controls ──────────────────────────
  MuiCheckbox: {
    defaultProps: { size: 'small' },
    styleOverrides: { root: { padding: 4 } },
  },
  MuiRadio: {
    defaultProps: { size: 'small' },
    styleOverrides: { root: { padding: 4 } },
  },
  MuiSwitch: { defaultProps: { size: 'small' } },
  MuiFormControlLabel: {
    styleOverrides: {
      root: { marginLeft: -4, marginRight: 8 },
      label: { fontSize: '0.875rem' },
    },
  },

  // ── Tables ──────────────────────────────────────
  MuiTable: { defaultProps: { size: 'small' } },
  MuiTableCell: {
    styleOverrides: {
      root: { padding: '6px 12px', fontSize: '0.8125rem' },
      sizeSmall: { padding: '4px 8px' },
      head: { fontWeight: 600, fontSize: '0.75rem' },
    },
  },

  // ── Lists & menus ──────────────────────────────
  MuiList: { defaultProps: { dense: true } },
  MuiListItem: { defaultProps: { dense: true } },
  MuiMenuItem: { defaultProps: { dense: true } },

  // ── Chips & badges ─────────────────────────────
  MuiChip: {
    defaultProps: { size: 'small' },
    styleOverrides: {
      root: { height: 24, fontSize: '0.75rem', borderRadius: 6 },
      label: { padding: '0 8px' },
    },
  },

  // ── Tabs ────────────────────────────────────────
  MuiTabs: { styleOverrides: { root: { minHeight: 36 } } },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        minHeight: 36,
        padding: '6px 12px',
        fontSize: '0.875rem',
        fontWeight: 500,
        minWidth: 'auto',
      },
    },
  },

  // ── Containers ─────────────────────────────────
  MuiToolbar: { defaultProps: { variant: 'dense' } },
  MuiCard: {
    defaultProps: { variant: 'outlined' },
    styleOverrides: { root: { borderRadius: 8 } },
  },
  MuiCardContent: {
    styleOverrides: {
      root: { padding: 12, '&:last-child': { paddingBottom: 12 } },
    },
  },
  MuiDialogTitle: { styleOverrides: { root: { padding: '12px 16px', fontSize: '1rem' } } },
  MuiDialogContent: { styleOverrides: { root: { padding: '8px 16px' } } },
  MuiDialogActions: { styleOverrides: { root: { padding: '8px 16px' } } },

  // ── Misc ────────────────────────────────────────
  MuiSvgIcon: { defaultProps: { fontSize: 'small' } },
  MuiPagination: { defaultProps: { size: 'small' } },
  MuiRating: { defaultProps: { size: 'small' } },
}

export const condensedThemeOptions: ThemeOptions = {
  spacing: 6,
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
    fontSize: 13,
    body1: { fontSize: '0.8125rem', lineHeight: 1.5 },
    body2: { fontSize: '0.75rem', lineHeight: 1.43 },
    subtitle1: { fontSize: '0.875rem' },
    subtitle2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.6875rem' },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: condensedComponentOverrides,
}

/** Standalone static condensed theme. Inherits MUI default palette (no brand colors). */
export const condensedTheme = createTheme(condensedThemeOptions)
