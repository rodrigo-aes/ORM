import type { SelectOptions } from "../SelectQueryBuilder"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"
import type { RelationsOptions } from "../JoinQueryBuilder/types"
import type { OrderQueryOptions } from "../OrderQueryBuilder/types"
import type { GroupQueryOptions } from "../GroupQueryBuilder/types"

export type FindQueryOptions<Entity extends object> = {
    select?: SelectOptions<Entity>
    where?: ConditionalQueryOptions<Entity>
    relations?: RelationsOptions<Entity>
    group?: GroupQueryOptions<Entity>
    order?: OrderQueryOptions<Entity>
    limit?: number
    offset?: number
}