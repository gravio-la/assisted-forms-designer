import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { condensedThemeOptions } from './condensedOverrides'

/**
 * Layers condensed density overrides on top of the current MUI theme.
 * Brand colors and palette mode (light/dark) are inherited from the parent.
 *
 * NOTE: We cannot use `createTheme(outerTheme, condensedThemeOptions)` because
 * MUI's multi-arg form deep-merges subsequent args onto the already-computed theme
 * without re-running createSpacing — so `spacing: 6` (number) would overwrite the
 * spacing function, crashing any component that calls `theme.spacing()`.
 *
 * Instead, we build a fresh theme from condensedThemeOptions and splice in the
 * parent palette (colors + mode) and any existing component overrides.
 */
function applyCondensedTheme(outerTheme: Theme): Theme {
  return createTheme({
    ...condensedThemeOptions,
    palette: {
      mode: outerTheme.palette.mode,
      primary: outerTheme.palette.primary,
      secondary: outerTheme.palette.secondary,
      error: outerTheme.palette.error,
      warning: outerTheme.palette.warning,
      info: outerTheme.palette.info,
      success: outerTheme.palette.success,
      background: outerTheme.palette.background,
    },
    components: {
      ...outerTheme.components,
      ...condensedThemeOptions.components,
    },
  })
}

export interface CondensedThemeWrapperProps {
  children: ReactNode
}

export function CondensedThemeWrapper({ children }: CondensedThemeWrapperProps) {
  return (
    <ThemeProvider theme={applyCondensedTheme}>
      {children}
    </ThemeProvider>
  )
}
