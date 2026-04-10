import type { ThemeOptions } from '@mui/material/styles'

/** Preset ids; `default` means use the parent app theme (no nested TopLevel palette). */
export const COLOR_THEME_IDS = [
  'default',
  // Light presets (listed first after default for quick access)
  'linen',
  'mist',
  'meadow',
  'peach',
  'daybreak',
  // Dark presets
  'ocean',
  'sunset',
  'forest',
  'lavender',
  'slate',
  'coral',
] as const

export type ColorThemeId = (typeof COLOR_THEME_IDS)[number]

/** When true, TopLevelLayout should not nest `ThemeProvider` and should not tint the app shell. */
export function usesParentTopLevelTheme(id: string | null | undefined): boolean {
  return id == null || id === '' || id === 'default'
}

/**
 * Returns MUI theme options for a named preset. Used with `createTheme` inside TopLevelLayout.
 * For `default`, returns an empty options object (caller should skip nesting and use the parent theme).
 */
export function getThemeOptionsForColorPreset(id: ColorThemeId): ThemeOptions {
  if (id === 'default') {
    return {}
  }
  switch (id) {
    case 'linen':
      return {
        palette: {
          mode: 'light',
          primary: { main: '#6d4c41' },
          secondary: { main: '#8d6e63' },
          background: { default: '#f5f0e8', paper: '#fffbf7' },
        },
      }
    case 'mist':
      return {
        palette: {
          mode: 'light',
          primary: { main: '#455a64' },
          secondary: { main: '#78909c' },
          background: { default: '#eceff1', paper: '#ffffff' },
        },
      }
    case 'meadow':
      return {
        palette: {
          mode: 'light',
          primary: { main: '#558b2f' },
          secondary: { main: '#7cb342' },
          background: { default: '#f1f8e9', paper: '#ffffff' },
        },
      }
    case 'peach':
      return {
        palette: {
          mode: 'light',
          primary: { main: '#e64a19' },
          secondary: { main: '#ff7043' },
          background: { default: '#fff3e0', paper: '#ffffff' },
        },
      }
    case 'daybreak':
      return {
        palette: {
          mode: 'light',
          primary: { main: '#f57c00' },
          secondary: { main: '#ffa726' },
          background: { default: '#fff8e1', paper: '#ffffff' },
        },
      }
    case 'ocean':
      return {
        palette: {
          mode: 'dark',
          primary: { main: '#4fc3f7' },
          secondary: { main: '#26c6da' },
          background: { default: '#0d3b4d', paper: '#102a35' },
        },
      }
    case 'sunset':
      return {
        palette: {
          mode: 'dark',
          primary: { main: '#ffb74d' },
          secondary: { main: '#ff8a65' },
          background: { default: '#3e2723', paper: '#2d1f1a' },
        },
      }
    case 'forest':
      return {
        palette: {
          mode: 'dark',
          primary: { main: '#81c784' },
          secondary: { main: '#aed581' },
          background: { default: '#1b2e1b', paper: '#152018' },
        },
      }
    case 'lavender':
      return {
        palette: {
          mode: 'dark',
          primary: { main: '#ce93d8' },
          secondary: { main: '#b39ddb' },
          background: { default: '#2d2640', paper: '#1e1a2e' },
        },
      }
    case 'slate':
      return {
        palette: {
          mode: 'dark',
          primary: { main: '#90a4ae' },
          secondary: { main: '#b0bec5' },
          background: { default: '#1c1f24', paper: '#121417' },
        },
      }
    case 'coral':
      return {
        palette: {
          mode: 'dark',
          primary: { main: '#f48fb1' },
          secondary: { main: '#ffab91' },
          background: { default: '#3b2432', paper: '#2a1a24' },
        },
      }
    default:
      return {}
  }
}

/**
 * Background `default` hex for the main wizard column shell tint from a preset id in Redux.
 * `default`, empty, or unset → no custom shell color (use theme `background.default`).
 */
export function getTopLevelShellBackgroundDefaultHex(
  id: string | null | undefined
): string | undefined {
  if (usesParentTopLevelTheme(id)) return undefined
  const opts = getThemeOptionsForColorPreset(id as ColorThemeId)
  const d = opts.palette?.background?.default
  return typeof d === 'string' ? d : undefined
}
