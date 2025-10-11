import type { EntityPropertiesKeys, EntityRelationsKeys } from "../../types"
import type { Case, CaseQueryOptions } from "../ConditionalSQLBuilder"

export type OrderDirection = 'ASC' | 'DESC'

export type OrderQueryOption<Entity extends object> = [
    EntityPropertiesKeys<Entity> | string,
    OrderDirection
]

export type OrderCaseOption<Entity extends object> = {
    [Case]: CaseQueryOptions<Entity>
}

export type OrderQueryOptions<Entity extends object> = (
    OrderQueryOption<Entity> | OrderCaseOption<Entity>
)[]