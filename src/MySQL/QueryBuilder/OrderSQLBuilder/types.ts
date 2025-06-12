import type { EntityPropertiesKeys } from "../types"
import type { Case, CaseQueryOptions } from "../ConditionalSQLBuilder"

export type OrderDirection = 'ASC' | 'DESC'

export type PropertyOrderQueryOption<Entity extends object> = [
    EntityPropertiesKeys<Entity>,
    OrderDirection
]

export type RelationOrderQueryOption = [
    string,
    OrderDirection
]

export type OrderCaseOption<Entity extends object> = {
    [Case]: CaseQueryOptions<Entity>
}

export type OrderQueryOption<Entity extends object> = (
    PropertyOrderQueryOption<Entity> |
    RelationOrderQueryOption
)

export type OrderQueryOptions<Entity extends object> = (
    OrderQueryOption<Entity> |
    OrderQueryOption<Entity>[] |
    OrderCaseOption<Entity>
)