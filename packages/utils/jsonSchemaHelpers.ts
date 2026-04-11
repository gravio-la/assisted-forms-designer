import { pathSegmentsToPath, pathToPathSegments } from './uiSchemaHelpers'
import { JsonSchema, isJsonSchema } from '@formswizard/types'

/**
 * insert or update a property into a nested schema by following the given path
 * will throw an error if the path is invalid
 * @param schema original json schema
 * @param path path to the nested schema
 * @param newKey new key for the property
 * @param newProperty the property to insert
 * @param ensurePath  if true, will create the path if it does not exist
 */
export const deeplySetNestedProperty: (
  schema: JsonSchema,
  path: string[],
  newKey: string,
  newProperty: JsonSchema,
  ensurePath?: Boolean
) => JsonSchema = (schema, path, newKey, newProperty, ensurePath = false) => {
  // Array schema: 'items' navigates into items.properties at any depth
  if ((schema as { type?: string }).type === 'array') {
    if (path.length === 0 || path[0] !== 'items') {
      throw new Error(`Expected 'items' path segment for array schema`)
    }
    const rawItems = (schema as { items?: unknown }).items
    const items: JsonSchema =
      rawItems && typeof rawItems === 'object' && !Array.isArray(rawItems)
        ? (rawItems as JsonSchema)
        : { type: 'object', properties: {} }
    const base: JsonSchema =
      (items as { type?: string }).type === 'object'
        ? items
        : { type: 'object', properties: {}, ...(items as object) }
    const rest = path.slice(1)
    return {
      ...schema,
      items: deeplySetNestedProperty(base, rest, newKey, newProperty, ensurePath),
    } as JsonSchema
  }

  if (!schema.properties) throw new Error(`Schema has no properties`)
  if (path.length === 0) {
    return {
      ...schema,
      properties: { ...schema.properties, [newKey]: newProperty },
    } as JsonSchema
  }
  const [first, ...rest] = path
  const nestedSchema = schema.properties[first]
  if (!nestedSchema && ensurePath) {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        [first]: deeplySetNestedProperty({ type: 'object', properties: {} }, rest, newKey, newProperty, ensurePath),
      },
    } as JsonSchema
  }
  if (isJsonSchema(nestedSchema) && ensurePath) {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        [first]: deeplySetNestedProperty(nestedSchema, rest, newKey, newProperty, ensurePath),
      },
    } as JsonSchema
  }
  throw new Error(`Could not find nested schema for ${first}`)
}
export const deeplyUpdateNestedSchema: (schema: JsonSchema, path: string[], newProperty: JsonSchema) => JsonSchema = (
  schema,
  path,
  newProperty
) => {
  if (path.length === 0) {
    return {
      ...schema,
      ...newProperty,
    } as JsonSchema
  }
  const [first, ...rest] = path
  const nestedSchema = schema.properties?.[first]
  if (!isJsonSchema(nestedSchema)) throw new Error(`Could not find nested schema for ${first}`)
  if (!schema.properties) throw new Error(`Schema has no properties`)
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyUpdateNestedSchema(nestedSchema, rest, newProperty),
    },
  } as JsonSchema
}
export const deeplyRemoveNestedProperty: (schema: JsonSchema, path: string) => JsonSchema = (schema, path) => {
  if (!schema.properties) throw new Error(`Schema has no properties`)
  const pathSegments = pathToPathSegments(path)
  if (pathSegments.length === 0) {
    return schema
  }
  if (pathSegments.length === 1) {
    return {
      ...schema,
      properties: Object.fromEntries(
        Object.entries(schema.properties).filter(
          // @ts-ignore
          ([key]) => key !== pathSegments[0]
        )
      ) as JsonSchema['properties'],
    } as JsonSchema
  }
  const [first, ...rest] = pathSegments
  const nestedSchema = schema.properties[first]
  if (!isJsonSchema(nestedSchema)) throw new Error(`Could not find nested schema for ${first}`)
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyRemoveNestedProperty(nestedSchema, pathSegmentsToPath(rest)),
    },
  } as JsonSchema
}
/**
 * Remove a JSON schema property at the given path (array of key segments).
 * Handles 'items' segments for array schemas at any depth, mirroring deeplySetNestedProperty.
 * Silently ignores paths that don't resolve (nothing to remove).
 *
 * e.g. ['advancedList', 'items', 'field1'] removes advancedList.items.properties.field1
 */
export const deeplyRemoveAtJsonSchemaPath = (schema: JsonSchema, path: string[]): JsonSchema => {
  if (path.length === 0) return schema

  if ((schema as { type?: string }).type === 'array') {
    if (path[0] !== 'items') return schema
    const rawItems = (schema as { items?: unknown }).items
    const items: JsonSchema =
      rawItems && typeof rawItems === 'object' && !Array.isArray(rawItems)
        ? (rawItems as JsonSchema)
        : { type: 'object', properties: {} }
    return { ...schema, items: deeplyRemoveAtJsonSchemaPath(items, path.slice(1)) } as JsonSchema
  }

  if (!schema.properties) return schema
  const [first, ...rest] = path
  if (!(first in schema.properties)) return schema

  if (rest.length === 0) {
    const { [first]: _removed, ...remaining } = schema.properties as Record<string, JsonSchema>
    return { ...schema, properties: remaining as JsonSchema['properties'] } as JsonSchema
  }

  const nested = schema.properties[first]
  if (!isJsonSchema(nested)) return schema
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyRemoveAtJsonSchemaPath(nested as JsonSchema, rest),
    },
  } as JsonSchema
}

export const deeplyRenameNestedProperty: (schema: JsonSchema, path: string[], newField: string) => JsonSchema = (
  schema,
  path,
  newField
) => {
  // Array schema: 'items' navigates into items
  if ((schema as { type?: string }).type === 'array') {
    if (path.length === 0 || path[0] !== 'items') throw new Error(`Expected 'items' path segment for array schema`)
    const rawItems = (schema as { items?: unknown }).items
    const items: JsonSchema =
      rawItems && typeof rawItems === 'object' && !Array.isArray(rawItems)
        ? (rawItems as JsonSchema)
        : { type: 'object', properties: {} }
    return { ...schema, items: deeplyRenameNestedProperty(items, path.slice(1), newField) } as JsonSchema
  }
  if (!schema.properties) throw new Error(`Schema has no properties`)
  if (path.length === 0) {
    return schema
  }
  if (path.length === 1) {
    const currentName = path[0]
    if (newField !== currentName && schema.properties[newField] !== undefined) {
      throw new Error(`A property "${newField}" already exists at this level`)
    }
    const value = schema.properties[path[0]]
    return {
      ...schema,
      properties: {
        ...(Object.fromEntries(
          Object.entries(schema.properties).filter(
            // @ts-ignore
            ([key]) => key !== path[0]
          )
        ) as JsonSchema['properties']),
        [newField]: value,
      },
    } as JsonSchema
  }
  const [first, ...rest] = path
  const nestedSchema = schema.properties[first]
  if (!isJsonSchema(nestedSchema)) throw new Error(`Could not find nested schema for ${first}`)
  if (rest.length === 1 && newField !== rest[0] && nestedSchema.properties?.[newField] !== undefined) {
    throw new Error(`A property "${newField}" already exists at this level`)
  }
  return {
    ...schema,
    properties: {
      ...schema.properties,
      [first]: deeplyRenameNestedProperty(nestedSchema, rest, newField),
    },
  } as JsonSchema
}


/**
 * recursively go through the jsonschema and replace all `$ref` from oldPath to newPath
 * will use a simple deep object tree traversal
 */
export const deeplyUpdateReference = <T>(jsonschemaPart: T, oldPath: string, newPath: string): T => {
  if (Array.isArray(jsonschemaPart)) {
    return jsonschemaPart.map(item => deeplyUpdateReference<any>(item, oldPath, newPath)) as T
  }
  if (typeof jsonschemaPart === 'object') {
    if ((jsonschemaPart as any).$ref === oldPath) {
      (jsonschemaPart as any).$ref = newPath
    }
    return Object.fromEntries(Object.entries(jsonschemaPart as Record<string, any>).map(([key, value]) => [key, deeplyUpdateReference(value, oldPath, newPath)])) as T
  }
  return jsonschemaPart
}


/**
 * Returns the key used for definitions in the given JSON schema.
 * If no definitions key is found, the default key "definitions" is returned.
 * @param schema
 */
export const getDefintitionKey: (schema: JsonSchema) => "definitions" | "$defs" = (schema: JsonSchema) =>
  "$defs" in schema ? "$defs" : "definitions";

/**
 * Returns the definitions object from the given JSON schema or an empty object if it does not exist.
 * @param schema the json schema
 * @returns the definitions object
 */
export const getDefinitions: (schema: JsonSchema) => Record<string, JsonSchema> = (schema: JsonSchema) =>
  ("$defs" in schema ? schema.$defs : schema.definitions) || {};