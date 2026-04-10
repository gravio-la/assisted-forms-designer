import { describe, expect, test } from 'bun:test'
import { getTopLevelShellBackgroundDefaultHex, usesParentTopLevelTheme } from './colorThemes'

describe('usesParentTopLevelTheme', () => {
  test('true when unset or default', () => {
    expect(usesParentTopLevelTheme(undefined)).toBe(true)
    expect(usesParentTopLevelTheme('')).toBe(true)
    expect(usesParentTopLevelTheme('default')).toBe(true)
  })

  test('false for named presets', () => {
    expect(usesParentTopLevelTheme('ocean')).toBe(false)
  })
})

describe('getTopLevelShellBackgroundDefaultHex', () => {
  test('no shell tint for parent theme', () => {
    expect(getTopLevelShellBackgroundDefaultHex('default')).toBeUndefined()
    expect(getTopLevelShellBackgroundDefaultHex(null)).toBeUndefined()
  })

  test('returns hex for presets', () => {
    expect(getTopLevelShellBackgroundDefaultHex('ocean')).toMatch(/^#/)
  })
})
