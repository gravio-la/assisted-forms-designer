import { describe, expect, test } from 'bun:test'
import type { ControlElement } from '@jsonforms/core'
import { imageBlobUploadTester } from './ImageBlobUploadControl'

const ctx = { rootSchema: {}, config: {} }

describe('imageBlobUploadTester', () => {
  test('matches Control + data-url format', () => {
    const ui: ControlElement = { type: 'Control', scope: '#/properties/img' }
    expect(
      imageBlobUploadTester(ui, { type: 'string', format: 'data-url' } as const, ctx)
    ).toBeGreaterThan(0)
  })

  test('does not match plain string', () => {
    const ui: ControlElement = { type: 'Control', scope: '#/properties/x' }
    expect(imageBlobUploadTester(ui, { type: 'string' } as const, ctx)).toBeLessThanOrEqual(0)
  })
})
