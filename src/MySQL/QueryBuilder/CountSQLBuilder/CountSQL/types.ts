import type {
    ConditionalQueryOptions,
    Case,
    CaseQueryOptions
} from "../../ConditionalSQLBuilder"

export type CountCaseOptions<Entity extends object> = {
    [Case]: CaseQueryOptions<Entity>
}

export type CountQueryOption<Entity extends object> = (
    string |
    ConditionalQueryOptions<Entity> |
    CountCaseOptions<Entity>
)