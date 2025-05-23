import type { EntityPropertiesKeys } from "../types"

export type OrderDirection = 'ASC' | 'DESC'

export type PropertyOrderQueryOption<Entity extends object> = [
    EntityPropertiesKeys<Entity>,
    OrderDirection
]

export type RelationOrderQueryOption = [
    string,
    OrderDirection
]

export type OrderQueryOption<Entity extends object> = (
    PropertyOrderQueryOption<Entity> |
    RelationOrderQueryOption
)

export type OrderQueryOptions<Entity extends object> = (
    OrderQueryOption<Entity> |
    OrderQueryOption<Entity>[]
)