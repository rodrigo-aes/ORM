import type { EntityProperties, EntityRelations } from "../types"
import type { OptionalNullable } from "../../../types/Properties"

export type CreationAttributes<Entity extends object> = (
    Partial<OptionalNullable<EntityProperties<Entity>>> &
    Partial<EntityRelations<Entity>>
)

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