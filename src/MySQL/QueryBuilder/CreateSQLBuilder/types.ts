import type { EntityProperties, EntityRelations } from "../types"
import type { OptionalNullable } from "../../../types/Properties"

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