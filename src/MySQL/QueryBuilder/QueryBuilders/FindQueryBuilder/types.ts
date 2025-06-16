import type { EntityTarget } from "../../../../types/General"
import type { FindOneQueryOptions } from "../FindOneQueryBuilder"
import type OrderQueryBuilder from "../OrderQueryBuilder"

export interface FindQueryOptions<
    T extends EntityTarget
> extends FindOneQueryOptions<T> {
    order?: OrderQueryBuilder<T>
    limit?: number
    offset?: number
}