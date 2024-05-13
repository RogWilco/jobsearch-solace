import { isNil, transpose } from '../core.utils'
import { OneOrMany } from '../utility.types'

/**
 * Available DTO subtypes/contexts.
 */
export type DtoContext<T extends string = never> =
  | 'getMany'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'nested'
  | T

/**
 * Specifies how the property is constrained for a given DTO subtype/context.
 */
export enum DtoDirective {
  /**
   * Property can be present, and will be used if present.
   */
  ALLOW = 'ALLOW',

  /**
   * Property must be present, will fail if missing.
   */
  REQUIRE = 'REQUIRE',

  /**
   * Property will be present. Alias of [[`DtoDirective.Require`]] (semantic
   * sugar for GET DTOs).
   */
  INCLUDE = REQUIRE,

  /**
   * Property must not be present, will fail if present.
   */
  EXCLUDE = 'EXCLUDE',

  /**
   * Property can be present, will be ignored.
   */
  IGNORE = 'IGNORE',
}

export type DtoPropertyKey<T> = keyof T & (string | symbol)

export type PropertyToDirective<T> = Partial<
  Record<DtoPropertyKey<T>, DtoDirective>
>

export type DirectiveToProperty<T> = Partial<
  Record<DtoDirective, OneOrMany<DtoPropertyKey<T>>>
>

export type ContextToDirective<C extends string = never> = Partial<
  Record<DtoContext<C>, DtoDirective>
>

export type DirectiveToContext<C extends string = never> = Partial<
  Record<DtoDirective, OneOrMany<DtoContext<C>>>
>

/**
 * Type guard that checks if the value is a [[`DtoDirective`]].
 *
 * @param value the value to be inspected
 *
 * @returns if the value passes the check
 */
export function isDirective(value: unknown): value is DtoDirective {
  return (
    (typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'symbol') &&
    value in DtoDirective
  )
}

/**
 * Applies the [[`DtoProperty.ALLOW`]] directive to one or more contexts, or all
 * if no contexts are specified.
 *
 * @param contextOrContexts zero or more contexts
 *
 * @returns a property decorator
 */
export function DtoPropertyAllow<C extends string = never>(
  ...contexts: DtoContext<C>[]
): PropertyDecorator {
  return DtoProperty(DtoDirective.ALLOW, ...contexts)
}

/**
 * Applies the [[`DtoProperty.REQUIRE`]] directive to one or more contexts, or all
 * if no contexts are specified.
 *
 * @param contextOrContexts zero or more contexts
 *
 * @returns a property decorator
 */
export function DtoPropertyRequire<C extends string = never>(
  ...contexts: DtoContext<C>[]
): PropertyDecorator {
  return DtoProperty(DtoDirective.REQUIRE, ...contexts)
}

/**
 * Applies the [[`DtoProperty.IGNORE`]] directive to one or more contexts, or all
 * if no contexts are specified.
 *
 * @param contextOrContexts zero or more contexts
 *
 * @returns a property decorator
 */
export function DtoPropertyIgnore<C extends string = never>(
  ...contexts: DtoContext<C>[]
): PropertyDecorator {
  return DtoProperty(DtoDirective.IGNORE, ...contexts)
}

/**
 * Applies the [[`DtoProperty.INCLUDE`]] directive to one or more contexts, or all
 * if no contexts are specified.
 *
 * @param contextOrContexts zero or more contexts
 *
 * @returns a property decorator
 */
export function DtoPropertyInclude<C extends string = never>(
  ...contexts: DtoContext<C>[]
): PropertyDecorator {
  return DtoProperty(DtoDirective.INCLUDE, ...contexts)
}

/**
 * Applies the [[`DtoProperty.EXCLUDE`]] directive to one or more contexts, or all
 * if no contexts are specified.
 *
 * @param contextOrContexts zero or more contexts
 *
 * @returns a property decorator
 */
export function DtoPropertyExclude<C extends string = never>(
  ...contexts: DtoContext<C>[]
): PropertyDecorator {
  return DtoProperty(DtoDirective.EXCLUDE, ...contexts)
}

/**
 * Marks a property for inclusion in DTOs derived from this class using the
 * default directive [[`DtoDirective.ALLOW`]] for all contexts.
 *
 * @return a property decorator
 */
export function DtoProperty(): PropertyDecorator

/**
 * Marks a property for inclusion in DTOs derived from this class using the
 * default directive [[`DtoDirective.ALLOW`]] for all contexts not included
 * in the provided config mapping.
 *
 * @param config additional mappings of directives to contexts
 *
 * @example
 * ```
 * // Apply a different directive depending on the context.
 * @DtoProperty({
 *   [DtoDirective.ALLOW]: ['get'],
 *   [DtoDirective.REQUIRE]: ['post', 'patch'],
 *   [DtoDirective.EXCLUDE]: 'getMany',
 * })
 * ```
 *
 * @return a property decorator
 */
export function DtoProperty<C extends string = never>(
  config: DirectiveToContext<C>,
): PropertyDecorator

/**
 * Marks a property for inclusion in DTOs derived from this class, using the
 * specified directive as the default for all contexts.
 *
 * @example
 * ```
 * // Exclude for all DTO contexts.
 * @DtoProperty(DtoDirective.EXCLUDE)
 * ```
 *
 * @param defaultDirective the default directive to use when no matching context is found ([[DtoDirective.Allow]] by default)
 *
 * @return a property decorator
 */
export function DtoProperty(defaultDirective: DtoDirective): PropertyDecorator

/**
 * Marks a property for inclusion in DTOs derived from this class using the
 * default directive [[`DtoDirective.ALLOW`]] for all contexts except the
 * specified directive and context.
 *
 * @example
 * ```
 * // Exclude for 'patch' DTOs.
 * @DtoProperty(DtoDirective.EXCLUDE, 'patch')
 * ```
 *
 * @param directive the desired directive to be mapped to a context
 * @param context the desired context for the directive
 *
 * @return a property decorator
 */
export function DtoProperty<C extends string = never>(
  directive: DtoDirective,
  context: DtoContext<C>,
): PropertyDecorator

/**
 * Marks a property for inclusion in DTOs derived from this class using the
 * default directive [[`DtoDirective.ALLOW`]] for all contexts except the
 * specified directive and contexts.
 *
 * @param directive the desired directive to be mapped to a context
 * @param contexts the desired contexts for the directive
 *
 * @example
 * ```
 * // Exclude for 'post' and 'patch DTOs.
 * @DtoProperty(DtoDirective.EXCLUDE, 'post', 'patch')
 * ```
 *
 * @return a property decorator
 */
export function DtoProperty<C extends string = never>(
  directive: DtoDirective,
  ...contexts: DtoContext<C>[]
): PropertyDecorator

/**
 * Marks a property for inclusion in DTOs derived from this class using the
 * default directive [[`DtoDirective.ALLOW`]] when one is not specified.
 *
 * @param directiveOrConfig the desired directive, applies the default if omitted
 * @param contexts the desired contexts for the directive, applies to all if omitted
 *
 * @returns a property decorator
 */
export function DtoProperty<C extends string = never>(
  directiveOrConfig?: DtoDirective | DirectiveToContext<C>,
  ...contexts: DtoContext<C>[]
): PropertyDecorator {
  const DEFAULT_DIRECTIVE = DtoDirective.ALLOW

  // @overload DtoProperty(): PropertyDecorator
  if (contexts.length === 0 && isNil(directiveOrConfig)) {
    return _decorate(DEFAULT_DIRECTIVE)
  }

  // @overload DtoProperty(config: DirectiveToContext): PropertyDecorator
  if (contexts.length === 0 && !isDirective(directiveOrConfig)) {
    return _decorate(
      undefined,
      transpose(
        directiveOrConfig as DirectiveToContext<C>,
      ) as ContextToDirective,
    )
  }

  // @overload @DtoProperty(defaultDirective: DtoDirective): PropertyDecorator
  if (contexts.length === 0 && isDirective(directiveOrConfig)) {
    return _decorate(directiveOrConfig)
  }

  // @overload @DtoProperty(directive: DtoDirective, context: DtoContext | string): PropertyDecorator
  // @overload @DtoProperty(directive: DtoDirective, contexts: (DtoContext | string)[]): PropertyDecorator
  if (contexts.length > 0 && isDirective(directiveOrConfig)) {
    return _decorate(
      undefined,
      transpose({ [directiveOrConfig]: contexts }) as ContextToDirective,
    )
  }

  throw new Error(
    `No overload matches this call: DtoProperty(${directiveOrConfig}, ${contexts.join(', ')})`,
  )
}

/**
 * Applies the DtoProperty decorator after overloaded arguments have been normalized.
 * @param defaultDirective
 * @param contextConfig
 * @returns
 */
function _decorate<C extends string = never>(
  defaultDirective?: DtoDirective,
  contextConfig?: ContextToDirective<C>,
): PropertyDecorator {
  return (target, propertyKey) => {
    // Add the property name to the list of DTO properties for the target object.
    Reflect.defineMetadata(
      'dto:properties',
      Array.from(
        new Set(
          Reflect.getMetadata('dto:properties', target.constructor) ?? [],
        ).add(propertyKey),
      ),
      target.constructor,
    )

    // Upsert the DTO directives for the property.
    Reflect.defineMetadata(
      'dto:property',
      {
        ...Reflect.getMetadata('dto:property', target, propertyKey),
        ...(defaultDirective && { __default: defaultDirective }),
        ...contextConfig,
      },
      target,
      propertyKey,
    )
  }
}
