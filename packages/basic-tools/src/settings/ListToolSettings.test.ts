import { describe, expect, test } from 'bun:test'
import ListToolSettings from './ListToolSettings'

const ctx = (root: object) => ({ rootSchema: root as any, config: {} })

describe('ListToolSettings', () => {
  test('mapWizardSchemaToToolData infers column types', () => {
    const wizardSchema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
          mail: { type: 'string', format: 'email' },
          day: { type: 'string', format: 'date' },
          at: { type: 'string', format: 'date-time' },
          ok: { type: 'boolean' },
          pick: { type: 'string', enum: ['a', 'b'] },
        },
      },
    }
    const data = ListToolSettings.mapWizardSchemaToToolData(wizardSchema as any, { options: {} })
    expect(data.columns).toEqual([
      { name: 'name', columnType: 'text' },
      { name: 'age', columnType: 'number' },
      { name: 'mail', columnType: 'email' },
      { name: 'day', columnType: 'date' },
      { name: 'at', columnType: 'dateTime' },
      { name: 'ok', columnType: 'boolean' },
      { name: 'pick', columnType: 'text' },
    ])
  })

  test('mapToolDataToWizardSchema builds properties from column types', () => {
    const wizardSchema = {
      type: 'array',
      items: { type: 'object', properties: {} },
    }
    const out = ListToolSettings.mapToolDataToWizardSchema(
      {
        columns: [
          { name: 'title', columnType: 'text' },
          { name: 'n', columnType: 'number' },
          { name: 'dt', columnType: 'dateTime' },
          { name: 'flag', columnType: 'boolean' },
        ],
        showSortButtons: true,
      },
      wizardSchema as any,
      wizardSchema as any
    )
    expect(out.items.properties.title).toEqual({ type: 'string' })
    expect(out.items.properties.n).toEqual({ type: 'number' })
    expect(out.items.properties.dt).toEqual({ type: 'string', format: 'date-time' })
    expect(out.items.properties.flag).toEqual({ type: 'boolean' })
  })

  test('tester matches simple list of primitives', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a: { type: 'string' },
        },
      },
    }
    const rank = ListToolSettings.tester(
      { type: 'Control', scope: '#/properties/x' } as any,
      schema as any,
      ctx(schema)
    )
    expect(rank).toBe(1)
  })

  test('tester backs off for nested object property', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a: { type: 'string' },
          nested: { type: 'object', properties: { x: { type: 'string' } } },
        },
      },
    }
    const rank = ListToolSettings.tester(
      { type: 'Control', scope: '#/properties/x' } as any,
      schema as any,
      ctx(schema)
    )
    expect(rank).toBe(0)
  })

  test('tester backs off when options.detail is set', () => {
    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          a: { type: 'string' },
        },
      },
    }
    const rank = ListToolSettings.tester(
      {
        type: 'Control',
        scope: '#/properties/x',
        options: { detail: { type: 'VerticalLayout', elements: [] } },
      } as any,
      schema as any,
      ctx(schema)
    )
    expect(rank).toBe(0)
  })
})
