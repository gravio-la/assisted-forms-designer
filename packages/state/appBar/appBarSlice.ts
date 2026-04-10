import { PaletteMode } from '@mui/material'
import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit'

import { RootState } from '../store'


export type AppBarState = {
  previewModus: boolean
  selectedLanguage: string
  themeMode: PaletteMode | string
  /**
   * Last TopLevelLayout `colorTheme` id written by the canvas (last writer wins).
   * Drives shell background in ThemeWrapper; does not import @formswizard/toplevel-layout (string only).
   */
  topLevelShellColorThemeId: string | null
}

export const selectPreviewModus = (state: RootState) => state.AppBar.previewModus
export const selectSelectedLanguage = (state: RootState) => state.AppBar.selectedLanguage
export const selectThemeMode = (state: RootState) => state.AppBar.themeMode
export const selectTopLevelShellColorThemeId = (state: RootState) =>
  state.AppBar.topLevelShellColorThemeId
let defaultThemeMode = 'light'
/*if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  defaultThemeMode = 'dark'
}*/
const appBarInitialState: AppBarState = {
  previewModus: false,
  selectedLanguage: 'de',
  themeMode: defaultThemeMode,
  topLevelShellColorThemeId: null,
}

export const appBarSlice = createSlice({
  name: 'appbar',
  initialState: appBarInitialState,

  reducers: {
    togglePreviewModus: (state: AppBarState) => {
      state.previewModus = !state.previewModus
    },
    changeSelectedLanguage: (state: AppBarState, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload
    },
    toggleColorMode: (state: AppBarState) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light'
    },
    setTopLevelShellColorTheme: (state: AppBarState, action: PayloadAction<string | null>) => {
      state.topLevelShellColorThemeId = action.payload
    },
  },
})

export const { togglePreviewModus, changeSelectedLanguage, toggleColorMode, setTopLevelShellColorTheme } =
  appBarSlice.actions

export const appBarReducer: Reducer<AppBarState> = appBarSlice.reducer


