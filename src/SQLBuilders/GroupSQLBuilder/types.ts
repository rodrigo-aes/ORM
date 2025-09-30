import type { EntityPropertiesKeys } from "../../types"

export type EntityGroupQueryOptions<Entity extends object> = (
    EntityPropertiesKeys<Entity>
)[]

export type RelationsGroupQueryOptions = string[]

export type GroupQueryOptions<Entity extends object> = (
    EntityGroupQueryOptions<Entity> |
    RelationsGroupQueryOptions
)