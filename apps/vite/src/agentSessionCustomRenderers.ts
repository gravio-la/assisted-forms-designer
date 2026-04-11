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
      'Geographic location field: string with JSON Schema format "wktLiteral". The UI shows a map and address search (Nominatim); the stored value is WKT text (e.g. "POINT(13.73 51.08)" — longitude first, then latitude). Use for "where", "address on a map", GPS, venue location, etc.\n\n' +
      'When mapNominatimFields is true, selecting a location via the search field or map will automatically fill other form fields using the Nominatim geocoder response. Each nominatimFieldMappings entry maps a Nominatim field name to a JsonForms scope path (e.g. "#/properties/city") — or "none" to skip that field. ' +
      'The scope path format is "#/properties/<field>" or "#/properties/<parent>/properties/<child>" for nested fields. ' +
      'When showConfirmationDialog is true, the user is shown a confirmation dialog with the resolved address data before the mapped fields are written.',
    jsonSchema: { type: 'string', format: 'wktLiteral' },
    uiOptionsSchema: {
      type: 'object',
      properties: {
        mapNominatimFields: {
          type: 'boolean',
          description:
            'When true, the location picker calls the Nominatim geocoder after a selection and fills other form fields according to nominatimFieldMappings.',
        },
        showConfirmationDialog: {
          type: 'boolean',
          description:
            'When true (and mapNominatimFields is also true), a confirmation dialog is shown before writing the mapped Nominatim fields into the form.',
        },
        nominatimFieldMappings: {
          type: 'object',
          description:
            'Maps each Nominatim address component to a form field via its JsonForms scope path. ' +
            'Set a value to a scope like "#/properties/streetName" to write that Nominatim component into the corresponding form field. ' +
            'Set to "none" to skip a component. Only active when mapNominatimFields is true.',
          properties: {
            name: {
              type: 'string',
              description: 'Place / venue name returned by Nominatim (top-level "name" key, not part of address object). Scope path or "none".',
            },
            display_name: {
              type: 'string',
              description: 'Full formatted one-line address string from Nominatim. Scope path or "none".',
            },
            office: {
              type: 'string',
              description: 'Office or building name. Scope path or "none".',
            },
            road: {
              type: 'string',
              description: 'Street / road name (without house number). Scope path or "none".',
            },
            house_number: {
              type: 'string',
              description: 'House / building number. Scope path or "none".',
            },
            neighbourhood: {
              type: 'string',
              description: 'Neighbourhood name. Scope path or "none".',
            },
            residential: {
              type: 'string',
              description: 'Residential area or estate name. Scope path or "none".',
            },
            suburb: {
              type: 'string',
              description: 'Suburb or borough. Scope path or "none".',
            },
            city_district: {
              type: 'string',
              description: 'City district or municipal subdivision. Scope path or "none".',
            },
            city: {
              type: 'string',
              description: 'City or town name. Scope path or "none".',
            },
            state: {
              type: 'string',
              description: 'State, province, or federal state name. Scope path or "none".',
            },
            'ISO3166-2-lvl4': {
              type: 'string',
              description: 'ISO 3166-2 level-4 state/province code (e.g. "DE-BY" for Bavaria). Scope path or "none".',
            },
            postcode: {
              type: 'string',
              description: 'Postal / ZIP code. Scope path or "none".',
            },
            country: {
              type: 'string',
              description: 'Country name. Scope path or "none".',
            },
            country_code: {
              type: 'string',
              description: 'Two-letter ISO 3166-1 alpha-2 country code (e.g. "de", "fr"). Scope path or "none".',
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
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
    name: 'TopLevel layout',
    description:
      'A layout element with type "TopLevelLayout" that wraps the form in a themed card shell with a headline, optional description, hero image, and color/font theming. ' +
      'This is a layout (not a data control) — it goes into the uiSchema "elements" array as { "type": "TopLevelLayout", "elements": [...], "options": { ... } }. ' +
      'All visual options are set in uiSchema options (see uiOptionsSchema). ' +
      'The fontFamily option references a font id registered in AvailableFontsProvider (e.g. "roboto", "opensans"); use "default" or omit to use the theme font. ' +
      'The image option accepts a data-url string (format "data-url") for a full-width hero image at the top of the card.',
    jsonSchema: { type: 'object', description: 'TopLevelLayout is a layout element — it does not bind to a specific JSON Schema data type.' },
    uiOptionsSchema: {
      type: 'object',
      properties: {
        headline: {
          type: 'string',
          description: 'Form title shown as an h1 heading inside the card. When omitted, a localised default ("My form") is shown.',
        },
        description: {
          type: 'string',
          description: 'Optional subtitle / description text rendered below the headline.',
        },
        colorTheme: {
          type: 'string',
          description:
            'Named color preset for the card. "default" (or omitting this option) uses the parent app theme. ' +
            'Light presets: "linen", "mist", "meadow", "peach", "daybreak". ' +
            'Dark presets: "ocean", "sunset", "forest", "lavender", "slate", "coral".',
          enum: [
            'default',
            'linen',
            'mist',
            'meadow',
            'peach',
            'daybreak',
            'ocean',
            'sunset',
            'forest',
            'lavender',
            'slate',
            'coral',
          ],
        },
        fontFamily: {
          type: 'string',
          description:
            'Font family id registered in the app\'s AvailableFontsProvider (e.g. "roboto", "opensans"). ' +
            'Omit or set to "default" to use the theme default.',
        },
        image: {
          type: 'string',
          description:
            'Data URL (format "data-url") of a hero image rendered as a full-width banner at the top of the card (max height 220 px, object-fit cover).',
        },
        disableRoundedBox: {
          type: 'boolean',
          description: 'When true, the card corners are square (border-radius 0). Default is rounded.',
        },
        cardElevation: {
          type: 'number',
          description: 'MUI Card elevation 0–24. When omitted, defaults to 6.',
          minimum: 0,
          maximum: 24,
        },
        fullWidth: {
          type: 'boolean',
          description:
            'When true, the outer Container uses full content width (maxWidth false). ' +
            'Use for wide layouts such as categorization tabs or steppers. Default is a narrow column (maxWidth "sm").',
        },
      },
      additionalProperties: false,
    },
  },
]
