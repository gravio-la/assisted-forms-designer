import { describe, expect, test } from 'bun:test'
import type { Layout } from '@jsonforms/core'
import { topLevelLayoutWithDropZoneTester } from './TopLevelLayoutWithDropZoneRenderer'

const ctx = { rootSchema: {}, config: {} }

describe('topLevelLayoutWithDropZoneTester', () => {
  test('matches TopLevelLayout with rank 10', () => {
    const ui: Layout = { type: 'TopLevelLayout', elements: [] }
    expect(topLevelLayoutWithDropZoneTester(ui, {}, ctx)).toBe(10)
  })

  test('does not match VerticalLayout', () => {
    const ui: Layout = { type: 'VerticalLayout', elements: [] }
    expect(topLevelLayoutWithDropZoneTester(ui, {}, ctx)).toBeLessThanOrEqual(0)
  })
})
