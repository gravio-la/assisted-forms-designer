import { describe, expect, test } from 'bun:test'
import { validateImageFileForUpload } from './imageUploadValidation'

describe('validateImageFileForUpload', () => {
  test('accepts small jpeg', () => {
    const file = new File([new Uint8Array(100)], 'x.jpg', { type: 'image/jpeg' })
    expect(validateImageFileForUpload(file, 512 * 1024)).toEqual({ ok: true })
  })

  test('rejects wrong mime', () => {
    const file = new File([new Uint8Array(10)], 'x.gif', { type: 'image/gif' })
    const r = validateImageFileForUpload(file, 512 * 1024)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.kind).toBe('invalidType')
  })

  test('rejects when over max bytes', () => {
    const file = new File([new Uint8Array(200)], 'x.jpg', { type: 'image/jpeg' })
    const r = validateImageFileForUpload(file, 100)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.kind).toBe('fileTooLarge')
  })

  test('rejects when mime not in allowed list', () => {
    const file = new File([new Uint8Array(10)], 'x.jpg', { type: 'image/jpeg' })
    const r = validateImageFileForUpload(file, 512 * 1024, ['image/png'])
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.kind).toBe('invalidType')
  })
})
