import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import type { BaseEntity } from 'typeorm'
import {
  coerceToArray,
  isNil,
  transpose,
  truncateIfPresent,
  upperFirst,
} from './core.utils'
import {
  DirectiveToProperty,
  DtoContext,
  DtoDirective,
  DtoPropertyKey,
  PropertyToDirective,
} from './decorators/dto-property.decorator'
import { Constructor, type Properties } from './utility.types'

export type EntityType<T extends BaseEntity = BaseEntity> = Constructor<T> &
  Properties<typeof BaseEntity>

export type DtoType<
  T,
  K extends DtoPropertyKey<T> = DtoPropertyKey<T>,
> = Constructor<Dto<T, K>>
export type Dto<T, K extends DtoPropertyKey<T> = DtoPropertyKey<T>> = Omit<
  Partial<Pick<T, K>> & Pick<T, K>,
  K
>

export class DtoBuilder<T, K extends DtoPropertyKey<T> = DtoPropertyKey<T>> {
  /**
   * Initializes a new DTO builder for the specified type.
   *
   * @param ObjectType the base type from which to build the DTO
   *
   * @returns an initialized DTO builder
   */
  public static from<T>(
    ObjectType: Constructor<T>,
  ): DtoBuilder<T, DtoPropertyKey<T>> {
    return new DtoBuilder(ObjectType)
  }

  /**
   * Initializes a new DTO builder for the specified type.
   *
   * @param _base the base type from which to build the DTO
   * @param _config optional initial property-to-directive map to start with
   */
  private constructor(
    private _base: Constructor<T>,
    private _config: PropertyToDirective<T> = {},
  ) {}

  /**
   * Applies the specified [[`DtoDirective`]] to the included keys.
   *
   * @param directive the directive to be applied
   * @param properties the target properties
   *
   * @returns the updated DTO builder
   */
  private _applyDirective(directive: DtoDirective, properties: K[]): this {
    this._config = properties.reduce((acc, p) => {
      return {
        ...acc,
        [p]: directive,
      }
    }, this._config)

    return this
  }

  /**
   * Derives a DTO property configuration from available metadata for the base
   * class (typically created with the [[DtoProperty]] decorator).
   *
   * @param context the desired DTO subtype/context
   *
   * @returns a DTO builder withe the updated config
   */
  public useContext<C extends string = never>(context?: DtoContext<C>): this {
    const dtoKeys: K[] = Reflect.getMetadata('dto:properties', this._base) ?? []

    dtoKeys.forEach((k) => {
      const keyConfig = Reflect.getMetadata(
        'dto:property',
        this._base.prototype,
        k,
      )

      if (isNil(context) || isNil(keyConfig[context])) {
        this._config[k] = keyConfig.__default
      } else {
        this._config[k] = keyConfig[context]
      }
    })

    return this
  }

  /**
   * Returns the derived type with all build steps applied.
   *
   * @returns the derived type produced from any previous build steps
   */
  public build(): DtoType<T> {
    const transposed: DirectiveToProperty<T> = transpose(this._config)

    // Construct the DTO.
    const Dto = OmitType(
      IntersectionType(
        PartialType(
          PickType(this._base, [
            ...coerceToArray(transposed.ALLOW),
            ...coerceToArray(transposed.IGNORE),
          ]),
        ),
        PickType(this._base, coerceToArray(transposed.REQUIRE)),
      ),
      // @ts-ignore
      coerceToArray(transposed.EXCLUDE),
    )

    // Post-Process: Apply Property Decorators

    // Apply @Exclude() to excluded properties.
    for (const property of coerceToArray(transposed.EXCLUDE)) {
      Exclude()(Dto, property)
    }

    // TODO: Post-Process: Apply Transforms

    return Dto as DtoType<T>
  }

  /**
   * Includes the specified properties from the base type, and marks them as
   * optional.
   *
   * @param properties the target properties
   *
   * @returns the updated DTO builder
   */
  public allow(properties: K[]): this {
    return this._applyDirective(DtoDirective.ALLOW, properties)
  }

  /**
   * Includes the specified properties from the base type, and ignores them.
   *
   * @param properties the properties to ignore
   *
   * @returns the updated DTO builder
   */
  public ignore(properties: K[]): this {
    return this._applyDirective(DtoDirective.IGNORE, properties)
  }

  /**
   * Includes the specified properties from the base type, and marks them as
   * required.
   *
   * @param properties the properties to require
   *
   * @returns the updated DTO builder
   */
  public require(properties: K[]): this {
    return this._applyDirective(DtoDirective.IGNORE, properties)
  }

  /**
   * Excludes the specified properties from the base type.
   *
   * @param properties the properties to exclude
   *
   * @returns the updated DTO builder
   */
  public exclude(properties: K[]): this {
    return this._applyDirective(DtoDirective.EXCLUDE, properties)
  }
}

/**
 * Mixin that returns a [[`BaseDto`]] for the specified entity class.
 *
 * @example
 * ```
 * // Given an entity with a decorated property...
 * class ExampleEntity {
 *  @DtoProperty({ 'post': DtoDirective.REQUIRE })
 *  exampleProperty: string = 'foo';
 * }
 *
 * // Create a POST DTO...
 * class PostDto extends BaseDto(ExampleEntity, 'post');
 * ```
 *
 * @param EntityType the entity class from which to build a DTO
 * @param context the DTO subtype/context
 *
 * @returns the [[`BaseDto`]] for the given entity
 */
export function BaseDto<T extends BaseEntity>(
  EntityType: EntityType<T>,
  context?: DtoContext | string,
): DtoType<T> {
  const name = `${truncateIfPresent(EntityType.name, 'Entity')}${upperFirst(context)}Dto`

  return {
    [name]: class extends DtoBuilder.from(EntityType as EntityType)
      .useContext(context)
      .build() {} as DtoType<T>,
  }[name]
}
