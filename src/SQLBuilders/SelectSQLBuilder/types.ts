import type { EntityPropertiesKeys } from "../types"
import type {
    Case,
    CaseQueryOptions
} from "../ConditionalSQLBuilder"
import type { CountQueryOptions } from "../CountSQLBuilder"

export type SelectPropertyKey<Entity extends object> = (
    '*' |
    EntityPropertiesKeys<Entity>
)

export type SelectCaseClause<Entity extends object> = {
    [Case]: CaseQueryOptions<Entity>,
    as: string
}

export type SelectPropertyOptions<Entity extends object> = (
    SelectPropertyKey<Entity> |
    SelectCaseClause<Entity>
)

export type SelectOptions<Entity extends object> = {
    properties?: SelectPropertyOptions<Entity>[] | '1' | null,
    count?: CountQueryOptions<Entity>
}