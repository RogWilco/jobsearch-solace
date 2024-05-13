/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A debugging type to help understand complex types.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type _Resolve<T> = {} & { [P in keyof T]: T[P] }

/**
 * A recursive version of {Identify}.
 *
 * CAUTION: This type is recursive and vulnerable to infinite loops.
 */
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/ban-types
export type _ResolveDeep<T> = T extends object ? {} & { [P in keyof T]: _ResolveDeep<T[P]> } : T

/**
 * Any primitive type.
 */
export type Primitive = string | number | boolean | bigint | symbol

/**
 * The name of any primitive type. Useful when using `typeof` in type guards.
 */
export type PrimitiveName =
  | 'string'
  | 'number'
  | 'boolean'
  | 'bigint'
  | 'symbol'

/**
 * Anything undefined or null.
 */
export type Nil = undefined | null

/**
 * Any value that can be used as a property key.
 */
export type PropertyKey = string | number | symbol

/**
 * Any function that returns T.
 */
export type Func<T = any, U extends any[] = any[]> = (...args: U) => T

/**
 * A predicate function that returns a boolean based on the arguments.
 */
export type Predicate = Func<boolean>

/**
 * A type guard function that asserts a given value is of type T.
 */
export type TypeGuard<T> = (value: T | unknown) => value is T

/**
 * A constructor of T.
 */
export type Constructor<T, U extends any[] = any[]> = new (...args: U) => T

/**
 * Construct a type containing all properties from T.
 */
export type Properties<T> = {
  [K in keyof T]: T[K]
}

/**
 * All properties in T of type U.
 */
export type PropertiesOfType<T, U> = {
  [K in KeysForPropertiesOfType<T, U>]-?: Exclude<T[K], undefined>
}

/**
 * Only the key names for all properties in T of type U.
 */
export type KeysForPropertiesOfType<T, U> = {
  [K in keyof T]-?: T[K] extends U | undefined ? K : never
}[keyof T]

/**
 * All properties in T except those of type U.
 */
export type PropertiesExceptType<T, U> = {
  [K in KeysForPropertiesExceptType<T, U>]: T[K] extends U ? never : T[K]
}

/**
 * Only the key names for all properties in T except those of type U.
 */
export type KeysForPropertiesExceptType<T, U> = {
  [K in keyof T]-?: T[K] extends U | undefined ? never : K
}[keyof T]

/**
 * Construct a type containing only the methods from T.
 */
export type Methods<T> = PropertiesOfType<T, Func>

/**
 * Construct a type containing only the data properties from T.
 */
export type DataProperties<T> = PropertiesExceptType<T, Func>

/**
 * Construct union of all of the property names in T.
 */
export type PropertyNames<T> = keyof T

/**
 * Get the type for property P in T.
 */
export type PropertyType<T, P extends keyof T> = T[P]

/**
 * Allow one T or an array of many Ts.
 */
export type OneOrMany<T> = T | T[]
