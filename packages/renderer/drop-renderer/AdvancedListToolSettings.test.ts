import { describe, expect, test } from 'bun:test'
import { AdvancedListToolSettings, collectLabelPathOptions } from './AdvancedListToolSettings'

describe('AdvancedListToolSettings', () => {
  test('collectLabelPathOptions lists dot paths and titles', () => {
    const item = {
      type: 'object',
      properties: {
        title: { type: 'string', title: 'Title' },
        nested: {
          type: 'object',
          properties: {
            code: { type: 'string', title: 'Code' },
          },
        },
      },
    } as const
    const opts = collectLabelPathOptions(item as any, item as any)
    expect(opts.map((o) => o.const)).toEqual(['nested.code', 'title'])
    expect(opts.find((o) => o.const === 'title')?.title).toBe('Title')
  })

  test('mapToolDataToWizardUischema keeps valid single label path', () => {
    const root = {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: { type: 'object', properties: { only: { type: 'string' } } },
        },
      },
    } as any
    const out = AdvancedListToolSettings.mapToolDataToWizardUischema(
      { showSortButtons: true, elementLabelProp: 'only' },
      { type: 'Control', scope: '#/properties/list', options: {} },
      root
    )
    expect(out.options?.showSortButtons).toBe(true)
    expect(out.options?.elementLabelProp).toBe('only')
  })

  test('mapToolDataToWizardUischema drops invalid label path', () => {
    const root = {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: { type: 'object', properties: { only: { type: 'string' } } },
        },
      },
    } as any
    const out = AdvancedListToolSettings.mapToolDataToWizardUischema(
      { showSortButtons: false, elementLabelProp: 'nope' },
      { type: 'Control', scope: '#/properties/list', options: { elementLabelProp: 'only' } },
      root
    )
    expect(out.options?.elementLabelProp).toBeUndefined()
  })

  test('mapToolDataToWizardUischema coerces legacy array to first string', () => {
    const root = {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: { type: 'object', properties: { a: { type: 'string' }, b: { type: 'string' } } },
        },
      },
    } as any
    const out = AdvancedListToolSettings.mapToolDataToWizardUischema(
      { elementLabelProp: ['b', 'a'] },
      { type: 'Control', scope: '#/properties/list', options: {} },
      root
    )
    expect(out.options?.elementLabelProp).toBe('b')
  })
})
