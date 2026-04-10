import type { AgentSessionCustomRenderer } from '@graviola/agent-chat-flow'

/**
 * Declares deployment-specific JsonForms controls for POST /api/session → system prompt
 * `<custom_renderers>`. Keep in sync with `ToolProvider` collections in main.tsx:
 * basic-tools, advanced-tools (incl. @formswizard/experimental-renderers location),
 * toplevel-layout, upload-tools.
 */
export const AGENT_SESSION_CUSTOM_RENDERERS: AgentSessionCustomRenderer[] = [
  {
    name: 'Location (map / WKT)',
    description:
      'Geographic location field: string with JSON Schema format "wktLiteral". The UI shows a map and address search (Nominatim); the stored value is WKT text (e.g. POINT for a single coordinate). Use for “where”, “address on a map”, GPS, venue location, etc. No extra uiOptions required for the default picker.',
    jsonSchema: { type: 'string', format: 'wktLiteral' },
  },
  {
    name: 'Data URL image (inline)',
    description:
      'String with format data-url — used for upload-tools image fields and for the TopLevel layout header image (JPEG, PNG, WebP, SVG embedded in the form).',
    jsonSchema: { type: 'string', format: 'data-url' },
  },
  {
    name: 'Multiselect combo',
    description:
      'For array-of-enum fields, set Control uiOptions.format to "combo" for a searchable multi-select (basic-tools).',
    jsonSchema: {
      type: 'array',
      uniqueItems: true,
      items: { type: 'string', enum: ['exampleA', 'exampleB'] },
    },
    uiOptions: { format: 'combo' },
    uiOptionsSchema: {
      type: 'object',
      properties: {
        format: { const: 'combo' },
      },
      required: ['format'],
      additionalProperties: true,
    },
  },
  {
    name: 'TopLevel layout — font family',
    description:
      'TopLevel layout shell option only (not a generic form field): fontFamily is a string with format font-family — values are font ids from the app or "default".',
    jsonSchema: { type: 'string', format: 'font-family' },
  },
]
