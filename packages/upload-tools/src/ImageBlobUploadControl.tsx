import {
  and,
  ControlProps,
  JsonSchema,
  RankedTester,
  rankWith,
  schemaMatches,
  uiTypeIs,
} from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material'
import { useCallback, useId, useMemo, useRef, useState } from 'react'
import { ALLOWED_IMAGE_MIME_TYPES } from './imageConstants'
import type { ImageValidationError } from './imageUploadValidation'
import { validateImageFileForUpload } from './imageUploadValidation'
import { useUploadToolsTranslation } from './useUploadToolsTranslation'

const DEFAULT_MAX_BYTES = 512 * 1024 // 512 KiB

export { ALLOWED_IMAGE_MIME_TYPES } from './imageConstants'

export type ImageBlobUploadControlProps = ControlProps

function formatValidationMessage(
  t: (key: string, opts?: Record<string, unknown>) => string,
  err: ImageValidationError
): string {
  if (err.kind === 'invalidType') {
    return t('imageUpload.invalidType', { type: err.type })
  }
  return t('imageUpload.fileTooLarge', {
    sizeKiB: err.sizeKiB,
    maxKiB: err.maxKiB,
  })
}

function ImageBlobUploadControlInner(props: ImageBlobUploadControlProps) {
  const { t } = useUploadToolsTranslation()
  const {
    data,
    handleChange,
    path,
    errors,
    label,
    description,
    required,
    enabled,
    visible,
    uischema,
  } = props

  const maxFromOptions =
    typeof uischema === 'object' &&
    uischema !== null &&
    'options' in uischema &&
    uischema.options &&
    typeof (uischema.options as { maxImageBytes?: unknown }).maxImageBytes === 'number'
      ? (uischema.options as { maxImageBytes: number }).maxImageBytes
      : undefined
  const maxBytes = maxFromOptions ?? DEFAULT_MAX_BYTES

  const allowedFormats = useMemo(() => {
    const raw = (uischema as { options?: { allowedFormats?: string[] } } | undefined)?.options
      ?.allowedFormats
    if (Array.isArray(raw) && raw.length > 0 && raw.every((x) => typeof x === 'string')) {
      return raw.filter((mime) =>
        (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mime)
      )
    }
    return [...ALLOWED_IMAGE_MIME_TYPES]
  }, [uischema])

  const acceptAttr = useMemo(() => allowedFormats.join(','), [allowedFormats])

  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const err = errors as unknown
  const schemaError = (() => {
    if (typeof err === 'string') return err
    if (Array.isArray(err)) {
      return err
        .map((e: { message?: string }) => e.message)
        .filter(Boolean)
        .join(', ')
    }
    return ''
  })()

  const clear = useCallback(() => {
    setLocalError(null)
    handleChange(path, undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [handleChange, path])

  const onFile = useCallback(
    (fileList: FileList | null) => {
      setLocalError(null)
      const file = fileList?.[0]
      if (!file) return

      const validation = validateImageFileForUpload(file, maxBytes, allowedFormats)
      if (validation.ok === false) {
        setLocalError(formatValidationMessage(t, validation.error))
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          handleChange(path, result)
        }
      }
      reader.onerror = () => {
        setLocalError(t('imageUpload.readError'))
      }
      reader.readAsDataURL(file)
    },
    [allowedFormats, handleChange, maxBytes, path, t]
  )

  if (!visible) {
    return null
  }

  const displayError = localError || schemaError

  return (
    <Box sx={{ width: '100%', py: 0.5 }}>
      <Stack spacing={1}>
        {(label || required) && (
          <Typography component="label" htmlFor={inputId} variant="body2" fontWeight={600}>
            {label}
            {required ? ' *' : ''}
          </Typography>
        )}
        {description && (
          <Typography variant="caption" color="text.secondary">
            {description}
          </Typography>
        )}

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Button
            variant="outlined"
            component="label"
            disabled={!enabled}
            startIcon={<AddPhotoAlternateIcon />}
            size="small"
          >
            {t('imageUpload.chooseImage')}
            <input
              id={inputId}
              ref={fileInputRef}
              type="file"
              accept={acceptAttr}
              hidden
              onChange={(e) => onFile(e.target.files)}
            />
          </Button>
          {data && typeof data === 'string' && data.startsWith('data:') && (
            <>
              <Avatar
                variant="rounded"
                src={data}
                alt=""
                sx={{ width: 72, height: 72, border: 1, borderColor: 'divider' }}
              />
              <Button
                size="small"
                color="inherit"
                disabled={!enabled}
                startIcon={<DeleteOutlineIcon />}
                onClick={clear}
              >
                {t('imageUpload.remove')}
              </Button>
            </>
          )}
        </Stack>

        {displayError ? (
          <Alert severity="error" onClose={() => setLocalError(null)}>
            {displayError}
          </Alert>
        ) : null}
      </Stack>
    </Box>
  )
}

export const ImageBlobUploadControl = withJsonFormsControlProps(ImageBlobUploadControlInner)

export const imageBlobUploadTester: RankedTester = rankWith(
  15,
  and(
    uiTypeIs('Control'),
    schemaMatches((schema) => {
      const s = schema as JsonSchema | undefined
      return !!(s && typeof s === 'object' && s.format === 'data-url')
    })
  )
)

export const imageBlobUploadRendererEntry = {
  tester: imageBlobUploadTester,
  renderer: ImageBlobUploadControl,
}
