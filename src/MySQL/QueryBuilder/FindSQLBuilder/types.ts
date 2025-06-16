import type { FindOneQueryOptions } from "../FindOneSQLBuilder"
import type { OrderQueryOptions } from "../OrderSQLBuilder/types"

export interface FindQueryOptions<
    Entity extends object
> extends FindOneQueryOptions<Entity> {
    order?: OrderQueryOptions<Entity>
    limit?: number
    offset?: number
}