import type { EntityPropertiesKeys } from "../../types"
import type {
    Case,
    CaseQueryOptions
} from "../ConditionalSQLBuilder"
import type { CountQueryOptions } from "../CountSQLBuilder"

export type SelectColumnsOption<Entity extends object> = (
    '*' |
    EntityPropertiesKeys<Entity>
)

export type SelectCaseOption<Entity extends object> = {
    [Case]: CaseQueryOptions<Entity>,
    as: string
}

export type SelectPropertyOptions<Entity extends object> = (
    SelectColumnsOption<Entity> |
    SelectCaseOption<Entity>
)

export type SelectOptions<Entity extends object> = {
    properties?: SelectPropertyOptions<Entity>[],
    count?: CountQueryOptions<Entity>
}