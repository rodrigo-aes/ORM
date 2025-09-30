import type { EntityPropertiesKeys } from "../../../types"
import type { CompatibleOperators } from "../Operator"
import type { ExistsQueryOptions } from "../ExistsSQLBuilder"

export type EntityAndQueryOptions<Entity extends object> = Partial<{
    [k in EntityPropertiesKeys<Entity>]: (
        Entity[k] |
        Partial<CompatibleOperators<Entity[k]>>
    )
}>

export type RelationAndQueryOptions = {
    [k: string]: any | Partial<CompatibleOperators<any>>
}

export type AndQueryOptions<Entity extends object> = (
    EntityAndQueryOptions<Entity> &
    RelationAndQueryOptions &
    Partial<ExistsQueryOptions<Entity>>
)