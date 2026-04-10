import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export interface FontDefinition {
  /** Unique identifier, used as the stored value in the form uiSchema options. */
  id: string
  /** Human-readable label shown in the font selector dropdown. */
  label: string
  /** CSS font-family string, e.g. `'"Playfair Display", "Georgia", serif'`. */
  fontFamily: string
}

const AvailableFontsContext = createContext<FontDefinition[]>([])

export interface AvailableFontsProviderProps {
  fonts: FontDefinition[]
  children: ReactNode
}

/**
 * Declares which fonts are available for TopLevel Layout cards.
 * When this provider is absent (or `fonts` is empty), the font selector
 * will not appear in the TopLevel tool settings.
 *
 * The app is responsible for loading the font files (via @fontsource packages,
 * @font-face declarations, or any other mechanism) before registering them here.
 */
export function AvailableFontsProvider({ fonts, children }: AvailableFontsProviderProps) {
  return (
    <AvailableFontsContext.Provider value={fonts}>
      {children}
    </AvailableFontsContext.Provider>
  )
}

export function useAvailableFonts(): FontDefinition[] {
  return useContext(AvailableFontsContext)
}
