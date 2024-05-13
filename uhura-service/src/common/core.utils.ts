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

export enum Sex {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  BOTH = 'BOTH',
}

export function removeNullAndUndefined<
  T extends Parameters<typeof Object.entries>[0],
>(objectOrArray: T): T {
  Object.entries(objectOrArray).forEach(([k, v]) => {
    if (v && typeof v === 'object') removeNullAndUndefined(v)
    if (
      (v && typeof v === 'object' && !Object.keys(v).length) ||
      v === null ||
      v === '' ||
      v === undefined
    ) {
      if (Array.isArray(objectOrArray)) {
        objectOrArray.splice(parseInt(k), 1)
      } else if (!(v instanceof Date)) {
        delete objectOrArray[k as keyof T]
      }
    }
  })
  return objectOrArray
}
