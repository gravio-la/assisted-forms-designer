import { isLayout, Layout, UISchemaElement } from '@jsonforms/core'
import last from 'lodash-es/last'
import isEmpty from 'lodash-es/isEmpty'
import { isScopableUISchemaElement, UISchemaElementWithPath, LayoutWithPath } from '@formswizard/types'
const insertIntoArray = <T>(arr: T[], index: number, element: T) => {
  return [...arr.slice(0, index), element, ...arr.slice(index)]
}
const insertAtPosOrEnd = <T>(arr: T[], index: number, element: T) => {
  return arr.length <= index ? [...arr, element] : insertIntoArray(arr, index, element)
}
/**
 * recursivly apply a function to a UISchemaElement and its children in case of a layout
 *
 * @param uischema
 * @param toApply
 */
export const recursivelyMapSchema = (
  uischema: UISchemaElement,
  toApply: (uischema: UISchemaElement) => UISchemaElement | undefined
): UISchemaElement | undefined => {
  if (isEmpty(uischema)) {
    return undefined
  }
  if (isLayout(uischema)) {
    const layout = uischema as Layout
    return toApply({
      ...uischema,
      elements: layout.elements
        .map((child) => recursivelyMapSchema(child, toApply))
        .filter((child): child is UISchemaElement => child !== undefined),
    } as UISchemaElement)
  }
  const withDetail = uischema as UISchemaElement & { options?: { detail?: UISchemaElement } }
  if (withDetail.options?.detail && isLayout(withDetail.options.detail)) {
    const detail = withDetail.options.detail as Layout
    return toApply({
      ...uischema,
      options: {
        ...withDetail.options,
        detail: {
          ...detail,
          elements: detail.elements
            .map((child) => recursivelyMapSchema(child, toApply))
            .filter((child): child is UISchemaElement => child !== undefined),
        },
      },
    } as UISchemaElement)
  }
  return toApply(uischema)
}
export const insertUISchemaAfterScope = (
  scope: string,
  newSchema: UISchemaElement,
  uiSchema: UISchemaElement,
  position?: number
) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema)) {
      const layout = uischema as Layout;
      if (layout.elements.find((el: UISchemaElement) => isScopableUISchemaElement(el) && el.scope === scope)) {
        // insert newElement after the element with scope
        const newElements =
          position === undefined
            ? layout.elements.reduce<UISchemaElement[]>(
              (acc, el: UISchemaElement) => {
                if (isScopableUISchemaElement(el) && el.scope === scope) {
                  return [...acc, el, newSchema];
                }
                return [...acc, el];
              },
              []
            )
            : insertAtPosOrEnd(layout.elements, position, newSchema)
        return {
          ...uischema,
          elements: newElements,
        } as UISchemaElement
      }
    }
    return uischema
  })
}
const walkUiSchemaDeep = (uiSchema: UISchemaElement, visit: (ui: UISchemaElement) => void) => {
  visit(uiSchema)
  if (isLayout(uiSchema) && uiSchema.elements) {
    uiSchema.elements.forEach((el) => walkUiSchemaDeep(el, visit))
  }
  const detail = (uiSchema as UISchemaElement & { options?: { detail?: UISchemaElement } }).options?.detail
  if (detail && isLayout(detail) && detail.elements) {
    detail.elements.forEach((el) => walkUiSchemaDeep(el, visit))
  }
}

export const getAllScopesInSchema = (uiSchema: UISchemaElement) => {
  const scopes: string[] = []
  walkUiSchemaDeep(uiSchema, (ui) => {
    if (isScopableUISchemaElement(ui) && typeof ui.scope === 'string' && ui.scope.startsWith('#')) {
      scopes.push(ui.scope)
    }
  })
  return scopes
}
export const removeUISchemaElement = (scope: string, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema) => {
    if (isLayout(uischema)) {
      const layout = uischema as Layout;
      if (layout.elements.find((el: UISchemaElement) => isScopableUISchemaElement(el) && el.scope === scope)) {
        // remove element with scope
        const newElements = layout.elements.filter((el: UISchemaElement) => !(isScopableUISchemaElement(el) && el.scope === scope))
        return {
          ...uischema,
          elements: newElements,
        } as UISchemaElement
      }
    }
    return uischema
  })
}

/**
 * Returns true if the given scope equals `targetScope` or is a nested path under it.
 * Uses path-segment boundaries to avoid false positives (e.g. #/properties/street
 * must not match #/properties/streetNumber).
 */
const scopeMatchesOrIsNestedUnder = (scope: string, targetScope: string): boolean =>
  scope === targetScope || scope.startsWith(targetScope + '/properties/')

export const updateScopeOfUISchemaElement = (scope: string, newScope: string, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema: UISchemaElement) => {
    let newUischema = uischema
    if (uischema.options?.scope && scopeMatchesOrIsNestedUnder(uischema.options.scope, scope)) {
      newUischema = {
        ...uischema,
        options: {
          ...uischema.options,
          scope: newScope + uischema.options.scope.slice(scope.length),
        }
      } as UISchemaElement
    }
    const itemPropsScope = (uischema.options as { itemPropertiesScope?: string } | undefined)?.itemPropertiesScope
    // itemPropertiesScope has the form `controlScope + '/items'` — only update it when
    // the exact control scope changes (avoids false-positive reprefixing from broad ancestor scopes).
    if (itemPropsScope && itemPropsScope === scope + '/items') {
      newUischema = {
        ...newUischema,
        options: {
          ...(newUischema as UISchemaElement).options,
          itemPropertiesScope: newScope + '/items',
        },
      } as UISchemaElement
    }
    if (isScopableUISchemaElement(uischema)) {
      if (uischema.scope && scopeMatchesOrIsNestedUnder(uischema.scope, scope)) {
        newUischema = {
          ...newUischema,
          scope: newScope + uischema.scope.slice(scope.length),
        } as UISchemaElement
      }
    }
    return newUischema
  })
}

export const updateUISchemaElement = (scope: string, newSchema: UISchemaElement, uiSchema: UISchemaElement) => {
  return recursivelyMapSchema(uiSchema, (uischema: UISchemaElement) => {
    if (isScopableUISchemaElement(uischema)) {
    if (uischema.scope === scope) {
      return newSchema
    }
    }
    return uischema
  })
}

export const pathToPathSegments: (path: string) => string[] = (path: string) => path.split('.')
export const getIndexFromPath: (path: string) => number = (path: string) => parseInt(last(path.split('.')) || '')

export const pathSegmentsToScope = (path: string[]) => {
  return `#/properties/${path.join('/properties/')}`
}

/**
 * Converts a JSON Schema scope (which may contain /items segments) to the JSON path array
 * needed to navigate the JSON Schema object tree.
 *
 * e.g. '#/properties/liste/items/properties/field' → ['liste', 'items', 'field']
 * e.g. '#/properties/liste/items' → ['liste', 'items']
 */
export const scopeToJsonSchemaPath = (scope: string): string[] => {
  if (!scope.startsWith('#/')) return []
  return scope.slice(2).split('/').filter((s) => s !== 'properties')
}

/**
 * Given a structural dot-path to a uiSchema element and its (possibly relative) scope,
 * returns the absolute scope from the root schema.
 *
 * For elements directly in the root layout the input scope is already absolute.
 * For elements inside options.detail, the stored scope is relative to the array's items
 * (e.g. '#/properties/number'). In that case we prefix it with the ancestor array's
 * itemPropertiesScope to get the absolute scope.
 */
export const resolveAbsoluteScope = (
  uiSchema: UISchemaElement,
  elementPath: string,
  relativeScope: string
): string => {
  const itemsScope = findItemPropertiesScopeForDropTarget(uiSchema, elementPath)
  if (!itemsScope) return relativeScope
  // relativeScope starts with '#'; replace '#' with itemsScope to make it absolute
  // e.g. '#/properties/number' + itemsScope '#/properties/list/items'
  //   → '#/properties/list/items/properties/number'
  return itemsScope + relativeScope.slice(1)
}

export const pathSegmentsToJSONPointer = (pathSegments: string[]) => {
  pathSegments.forEach((segment) => {
    if (segment.includes('/')) {
      throw new Error('path segments must not contain slashes')
    }
  })
  return `/${pathSegments.join('/')}`
}

/**
 * converts an array of strings to a json pointer
 * @throws  Error is segments contain a '.'
 * @param pathSegments
 */
export const pathSegmentsToPath = (pathSegments: string[]) => {
  pathSegments.forEach((segment) => {
    if (segment.includes('.')) {
      throw new Error('path segments must not contain dots')
    }
  })
  return pathSegments.join('.')
}

/**
 * from a given path foo.bar.baz returns baz and foo.bar
 * @param path
 */
export const splitLastPath: (path: string) => [string | undefined, string | undefined] = (path: string) => {
  const segments = pathToPathSegments(path)
  if (segments.length <= 0) return [undefined, undefined]
  const rest = segments.slice(0, segments.length - 1)
  const restPath = rest.length <= 0 ? undefined : rest.join('.')
  return [segments[segments.length - 1], restPath]
}
export const pathToScope = (path: string) => pathSegmentsToScope(pathToPathSegments(path))

export const scopeToPathSegments = (scope: string) => {
  if (!scope.startsWith('#/')) return []
  const [, ...rest] = scope.split('/properties/')
  return rest
}

/**
 * recursively add a path, that uniquely identifies a schema element, to a UISchemaElement
 */
export const extendUiSchemaWithPath = (
  uiSchema: UISchemaElement,
  pathSegments: string[] = [],
  structurePathSegments: string[] = []
): UISchemaElementWithPath | LayoutWithPath => {
  if (isLayout(uiSchema)) {
    const layout = uiSchema as Layout
    return {
      ...layout,
      elements: layout.elements.map((el, index) =>
        extendUiSchemaWithPath(
          el,
          [...pathSegments, 'elements', index.toString()],
          [...structurePathSegments, el.type, index.toString()]
        )
      ),
      path: pathSegmentsToPath(pathSegments),
      structurePath: pathSegmentsToPath(structurePathSegments),
    }
  }
  const withOpts = uiSchema as UISchemaElement & {
    options?: { detail?: UISchemaElement }
  }
  if (withOpts.options?.detail && isLayout(withOpts.options.detail)) {
    const detail = withOpts.options.detail as Layout
    return {
      ...uiSchema,
      options: {
        ...withOpts.options,
        detail: {
          ...detail,
          elements: detail.elements.map((el, index) =>
            extendUiSchemaWithPath(
              el,
              [...pathSegments, 'options', 'detail', 'elements', index.toString()],
              [...structurePathSegments, detail.type, index.toString()]
            )
          ),
        },
      },
      path: pathSegmentsToPath(pathSegments),
      structurePath: pathSegmentsToPath(structurePathSegments),
    } as UISchemaElementWithPath
  }
  return {
    ...uiSchema,
    path: pathSegmentsToPath(pathSegments),
    structurePath: pathSegmentsToPath(structurePathSegments),
  }
}

function getUiSchemaAtDotPath(uiSchema: UISchemaElement, segments: string[]): UISchemaElement | undefined {
  let cur: unknown = uiSchema
  for (const s of segments) {
    if (cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[s]
  }
  return cur as UISchemaElement | undefined
}

/**
 * When dropping into an array row template (`options.detail.elements`), returns the JSON Schema
 * scope for `items.properties` (e.g. `#/properties/myList/items`) from the nearest ancestor Control.
 */
export const findItemPropertiesScopeForDropTarget = (
  uiSchema: UISchemaElement,
  elementPath: string
): string | null => {
  if (!elementPath) return null
  const segments = pathToPathSegments(elementPath)
  // Start from len-1 so we look at ANCESTORS of the drop target, not the target itself.
  // This prevents a drop next to an advanced list from inheriting its itemPropertiesScope.
  for (let len = segments.length - 1; len >= 1; len--) {
    const node = getUiSchemaAtDotPath(uiSchema, segments.slice(0, len))
    const scope = (node as { type?: string; options?: { itemPropertiesScope?: string } })?.options
      ?.itemPropertiesScope
    if (node?.type === 'Control' && typeof scope === 'string') {
      return scope
    }
  }
  return null
}

/**
 * Recursively collect the absolute JSON schema scopes of every Control inside a UI schema subtree.
 * Used when deleting a layout to also clean up all referenced JSON schema properties.
 *
 * - Controls: adds their absolute scope (resolving relative scopes in options.detail via ancestor
 *   itemPropertiesScope) and stops recursion — deleting the array property automatically removes
 *   its items, so we never need to descend into options.detail.
 * - Layouts: recurses into their elements.
 * - Other types: ignored.
 *
 * @param subtree - the UI schema subtree to walk (the element being deleted)
 * @param subtreeUIPath - dot-path of `subtree` within `rootUISchema` (e.g. "elements.0")
 * @param rootUISchema - the full root UI schema (needed for resolveAbsoluteScope)
 */
export const collectControlScopesInSubtree = (
  subtree: UISchemaElement,
  subtreeUIPath: string,
  rootUISchema: UISchemaElement
): string[] => {
  const scopes: string[] = []

  if (subtree.type === 'Control') {
    const scope = (subtree as { scope?: string }).scope
    if (scope) {
      scopes.push(resolveAbsoluteScope(rootUISchema, subtreeUIPath, scope))
    }
    return scopes
  }

  if (isLayout(subtree)) {
    const elements = ((subtree as Layout).elements) ?? []
    elements.forEach((child, index) => {
      const childPath = subtreeUIPath ? `${subtreeUIPath}.elements.${index}` : `elements.${index}`
      scopes.push(...collectControlScopesInSubtree(child, childPath, rootUISchema))
    })
  }

  return scopes
}
