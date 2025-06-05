import type { EntityProperties, EntityRelations } from "../types"

type OptionalNullable<T> = {
    [K in keyof T as undefined extends T[K]
    ? K
    : null extends T[K]
    ? K
    : never]?: T[K]
} & {
    [K in keyof T as undefined extends T[K]
    ? never
    : null extends T[K]
    ? never
    : K]: T[K]
}


export type EntityCreationAttributes<Entity extends object> = (
    Partial<OptionalNullable<EntityProperties<Entity>>> &
    Partial<EntityRelations<Entity>>
)

export type CreationAttributes<Entity extends object> = (
    EntityCreationAttributes<Entity> |
    EntityCreationAttributes<Entity>[]
)

export type CreationAttibutesKey<Entity extends object> = (
    keyof EntityCreationAttributes<Entity>
)

export type AttributesNames<Entity extends object> = Set<
    CreationAttibutesKey<Entity>
>