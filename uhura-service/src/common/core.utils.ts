import { Constructor, Nil, OneOrMany, PrimitiveName } from './utility.types'

/**
 * Type guard that checks whether the value is [[Nil]] ([[undefined]] or
 * [[null]]).
 *
 * @param value the value to be inspected
 *
 * @returns if the value passes the check
 */
export function isNil(value?: unknown): value is Nil {
  return value === undefined || value === null
}

/**
 * Type guard that checks if the value is an array of type T.
 *
 * @param value the value to be inspected
 * @param type the name of a primitive type as a string, or a class
 *
 * @returns if the value is an array of type T
 */
export function isArray<T>(
  value: unknown,
  type: PrimitiveName | Constructor<T>,
): value is T[] {
  if (!Array.isArray(value)) {
    return false
  }

  // Empty arrays will always return true.
  if (value.length === 0) {
    return true
  }

  if (typeof type === 'string') {
    return typeof value[0] === type
  }

  return value[0] instanceof type
}

/**
 * Conerces a value to an array containing itself. If it is already an array,
 * it is returned unmodifed.
 *
 * @param value the value to be coerced to an array
 *
 * @returns the resulting array
 */
export function coerceToArray<T>(value?: OneOrMany<T>): T[] {
  if (Array.isArray(value)) {
    return value
  }

  return isNil(value) ? [] : [value]
}

export type Transposable<
  A extends PropertyKey,
  B extends PropertyKey,
> = Partial<Record<A, OneOrMany<B>>>

/**
 * Transposes an object, swapping its keys with its values. Values must be of a
 * type that can be a valid key.
 *
 * If a value is an array, it will be split into multiple keys on the new
 * object.
 *
 * If more than one key contains the same value, the keys will be combined into
 * an array in the new object.
 *
 * @param incoming the incoming object to be transposed
 *
 * @returns the transposed object
 */
export function transpose<K extends PropertyKey, V extends PropertyKey>(
  incoming: Transposable<K, V>,
): Transposable<V, K> {
  const result: Transposable<V, K> = {}

  for (const k in incoming) {
    coerceToArray(incoming[k]).map((v) => {
      result[v] = result[v] ? [...coerceToArray(result[v]), k] : k
    })
  }

  return result
}

/**
 * Capitalizes the first character of the string.
 *
 * @param value the target string
 *
 * @returns a new string with the first character capitalized
 */
export function upperFirst(value?: string): string | undefined {
  if (isNil(value)) {
    return value
  }

  return value.slice(0, 1).toUpperCase() + value.slice(1, value.length)
}

/**
 * Truncates the string, removing the specified search string if present.
 *
 * @param value the target string
 * @param search the search string
 *
 * @returns a new string with the search string truncated if present
 */
export function truncateIfPresent(
  value?: string,
  search?: string,
): string | undefined {
  if (isNil(search) || isNil(value)) {
    return value
  }

  return value.substr(-search.length) === search
    ? value.substr(0, value.length - search.length)
    : value
}

/**
 * A tag function that expands an object into the given teplate literal.
 *
 * @example
 * ```
 * // Given an object literal with values to be used...
 * const config = {
 *   protocol: 'https',
 *   host: 'example.com',
 *   port: 1337,
 *   path: 'some/random/path',
 * }
 *
 * // Expand into the tagged template to make a URL...
 * const url = expand`${'protocol'}://${'host'}:${'port'}/${'path'}`(config);
 *
 * console.log(url);    // Outputs: https://example.com:1337/some/random/path
 * ```
 *
 * @param parts the literal components of the template literal
 * @param keys the keys for values to be substituted in the string
 *
 * @returns a function that accepts an object literal with matching keys
 */
export function expand(
  parts: TemplateStringsArray,
  ...keys: (string | number)[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (data: Record<string | number, any>) => string {
  const strings = Array.from(parts)

  return (data) => {
    const result = [strings.shift()]

    for (const key of keys) {
      result.push(data[key], strings.shift())
    }

    return result.join('')
  }
}
