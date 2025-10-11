import type { EntityPropertiesKeys } from "../../../types"
import type { CompatibleOperators } from "../Operator"
import type { ExistsQueryOptions } from "../ExistsSQLBuilder"

export type PropAndQueryOptions<Entity extends object> = Partial<{
    [K in EntityPropertiesKeys<Entity>]: (
        Entity[K] |
        Partial<CompatibleOperators<Entity[K]>>
    )
}>

export type RelationAndQueryOptions = {
    [k: string]: any | Partial<CompatibleOperators<any>>
}

export type AndQueryOptions<Entity extends object> = (
    PropAndQueryOptions<Entity> &
    RelationAndQueryOptions &
    Partial<ExistsQueryOptions<Entity>>
)