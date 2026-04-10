import { ALLOWED_IMAGE_MIME_TYPES } from './imageConstants'

export type ImageValidationError =
  | { kind: 'invalidType'; type: string }
  | { kind: 'fileTooLarge'; sizeKiB: number; maxKiB: number }

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: ImageValidationError }

/**
 * Client-side validation for tool-setting / embedded images (no server).
 */
export function validateImageFileForUpload(
  file: File,
  maxBytes: number,
  allowedMimeTypes: readonly string[] = ALLOWED_IMAGE_MIME_TYPES
): ImageValidationResult {
  const type = file.type || 'unknown'
  if (!allowedMimeTypes.includes(file.type)) {
    return {
      ok: false,
      error: { kind: 'invalidType', type },
    }
  }
  if (file.size > maxBytes) {
    return {
      ok: false,
      error: {
        kind: 'fileTooLarge',
        sizeKiB: Math.ceil(file.size / 1024),
        maxKiB: Math.ceil(maxBytes / 1024),
      },
    }
  }
  return { ok: true }
}
