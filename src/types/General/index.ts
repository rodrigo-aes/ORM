import type BaseEntity from "../../MySQL/BaseEntity"
import type BasePolymorphicEntity from "../../MySQL/BasePolymorphicEntity"
import type { Collection } from "../../MySQL/BaseEntity"

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

