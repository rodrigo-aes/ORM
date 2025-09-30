import type { OptionalNullable, EntityProperties } from "../../types"

export type CreationAttributes<Entity extends object> = OptionalNullable<
    EntityProperties<Entity>
>

export type CreationAttributesOptions<Entity extends object> = (
    CreationAttributes<Entity> |
    CreationAttributes<Entity>[]
)

export type CreationAttibutesKey<Entity extends object> = (
    keyof CreationAttributes<Entity>
)

export type AttributesNames<Entity extends object> = Set<
    CreationAttibutesKey<Entity>
>