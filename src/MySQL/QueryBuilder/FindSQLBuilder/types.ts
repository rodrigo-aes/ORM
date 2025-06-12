import type { EntityTarget } from "../../../types/General"

import type { SelectOptions } from "../SelectSQLBuilder"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { RelationsOptions } from "../JoinSQLBuilder/types"
import type { OrderQueryOptions } from "../OrderSQLBuilder/types"
import type { GroupQueryOptions } from "../GroupSQLBuilder/types"

export type FindQueryOptions<Entity extends object> = {
    select?: SelectOptions<Entity>
    where?: ConditionalQueryOptions<Entity>
    relations?: RelationsOptions<Entity>
    group?: GroupQueryOptions<Entity>
    order?: OrderQueryOptions<Entity>
    limit?: number
    offset?: number
}

export type IncludedQueryEntities = [
    string,
    string | undefined,
    EntityTarget | EntityTarget[]
][] 