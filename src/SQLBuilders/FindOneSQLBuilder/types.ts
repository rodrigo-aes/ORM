import type { EntityTarget } from "../../types/General"

import type { SelectOptions } from "../SelectSQLBuilder"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { RelationsOptions } from "../JoinSQLBuilder/types"
import type { GroupQueryOptions } from "../GroupSQLBuilder/types"

export type FindOneQueryOptions<Entity extends object> = {
    select?: SelectOptions<Entity>
    where?: ConditionalQueryOptions<Entity>
    relations?: RelationsOptions<Entity>
    group?: GroupQueryOptions<Entity>
}