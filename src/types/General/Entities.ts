import type { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"
import BaseEntity from "../../BaseEntity"
import type BasePolymorphicEntity from "../../BasePolymorphicEntity"
import type Repository from "../../Repository"
import type PolymorphicRepository from "../../PolymorphicRepository"
import type { Constructor, InstancesOf } from "."

export type Entity = BaseEntity | BasePolymorphicEntity<any>
export type Target = EntityTarget | PolymorphicEntityTarget
export type StaticTarget = StaticEntityTarget | StaticPolymorphicEntityTarget

// ----------------------------------------------------------------------------

export type EntityTarget = Constructor<BaseEntity>
export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type StaticEntityTarget = EntityTarget & typeof BaseEntity

// ----------------------------------------------------------------------------

export type PolymorphicEntityTarget = Constructor<BasePolymorphicEntity<any>>
export type AsPolymorphicEntityTarget<T> = Extract<T, PolymorphicEntityTarget>
export type StaticPolymorphicEntityTarget = (
    PolymorphicEntityTarget & typeof BasePolymorphicEntity
)

export type TargetMetadata<T extends Target> = (
    T extends EntityTarget
    ? EntityMetadata
    : T extends PolymorphicEntityTarget
    ? PolymorphicEntityMetadata
    : never
)

export type TargetRepository<T extends Target> = (
    T extends EntityTarget
    ? Repository<T>
    : T extends PolymorphicEntityTarget
    ? PolymorphicRepository<T>
    : never
)

// ----------------------------------------------------------------------------

export type InternalPolymorphicEntityTarget<T extends EntityTarget[]> = (
    Constructor<BasePolymorphicEntity<InstancesOf<T>>>
)

export type LocalOrInternalPolymorphicEntityTarget<
    T extends PolymorphicEntityTarget | EntityTarget[]
> = (
        T extends PolymorphicEntityTarget
        ? T
        : T extends EntityTarget[]
        ? InternalPolymorphicEntityTarget<T>
        : never
    )
