import { describe, expect, test } from 'bun:test'
import type { Layout } from '@jsonforms/core'
import { toplevelLayoutTester } from './ToplevelLayoutRenderer'

const ctx = { rootSchema: {}, config: {} }

describe('toplevelLayoutTester', () => {
  test('matches TopLevelLayout', () => {
    const ui: Layout = { type: 'TopLevelLayout', elements: [] }
    expect(toplevelLayoutTester(ui, {}, ctx)).toBeGreaterThan(0)
  })

  test('does not match VerticalLayout', () => {
    const ui: Layout = { type: 'VerticalLayout', elements: [] }
    expect(toplevelLayoutTester(ui, {}, ctx)).toBeLessThanOrEqual(0)
  })
})

