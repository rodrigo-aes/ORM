import type BaseEntity from "../../BaseEntity"
import type BasePolymorphicEntity from "../../BasePolymorphicEntity"

import type {
    EntityMetadata,
    PolymorphicEntityMetadata
} from "../../Metadata"

import type { Collection } from "../../BaseEntity"

export type EntityTarget = new (...args: any[]) => BaseEntity
export type PolymorphicEntityTarget = (
    new (...args: any[]) => BasePolymorphicEntity<any>
)

export type CollectionTarget = new (...args: any[]) => Collection<any>

export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type AsPolymorphicEntityTarget<T> = Extract<T, PolymorphicEntityTarget>

export type Constructor<T extends object> = new (...args: any[]) => T

export type InternalPolymorphicEntityTarget<T extends EntityTarget[]> = (
    new (...args: any[]) => BasePolymorphicEntity<InstancesOf<T>>
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

type InstancesOf<T extends (EntityTarget | PolymorphicEntityTarget)[]> = {
    [K in keyof T]: InstanceType<T[K]>
}

export type Primitive = string | number | boolean | Date | null

export type Target = EntityTarget | PolymorphicEntityTarget
export type TargetMetadata<
    T extends EntityTarget | PolymorphicEntityTarget
> = T extends EntityTarget
    ? EntityMetadata
    : T extends PolymorphicEntityTarget
    ? PolymorphicEntityMetadata
    : never
