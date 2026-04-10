import type { LanguageTranslations } from '@formswizard/types'

export const translations: LanguageTranslations = {
  en: {
    'imageUpload.chooseImage': 'Choose image',
    'imageUpload.remove': 'Remove',
    'imageUpload.readError': 'Could not read file.',
    'imageUpload.invalidType':
      'Invalid type: {{type}}. Use JPEG, PNG, WebP, or SVG.',
    'imageUpload.fileTooLarge':
      'File too large ({{sizeKiB}} KiB). Max {{maxKiB}} KiB.',

    'tools.imageBlobUpload': 'Image upload',
    'maxImageKiB.label': 'Max image size (KiB)',
    'allowedFormats.label': 'Allowed formats',
    'allowedFormats.image/jpeg': 'JPEG',
    'allowedFormats.image/png': 'PNG',
    'allowedFormats.image/webp': 'WebP',
    'allowedFormats.image/svg+xml': 'SVG',
  },
  de: {
    'imageUpload.chooseImage': 'Bild auswählen',
    'imageUpload.remove': 'Entfernen',
    'imageUpload.readError': 'Datei konnte nicht gelesen werden.',
    'imageUpload.invalidType':
      'Ungültiger Typ: {{type}}. Verwende JPEG, PNG, WebP oder SVG.',
    'imageUpload.fileTooLarge':
      'Datei zu groß ({{sizeKiB}} KiB). Max {{maxKiB}} KiB.',

    'tools.imageBlobUpload': 'Bild-Upload',
    'maxImageKiB.label': 'Max. Bildgröße (KiB)',
    'allowedFormats.label': 'Erlaubte Formate',
    'allowedFormats.image/jpeg': 'JPEG',
    'allowedFormats.image/png': 'PNG',
    'allowedFormats.image/webp': 'WebP',
    'allowedFormats.image/svg+xml': 'SVG',
  },
}
