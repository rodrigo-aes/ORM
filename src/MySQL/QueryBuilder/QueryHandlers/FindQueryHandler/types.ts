import type { EntityTarget } from "../../../../types/General"

import type SelectQueryHandler from "../SelectQueryHandler"
import type WhereQueryHandler from "../WhereQueryHandler"
import type JoinQueryHandler from "../JoinQueryHandler"
import type GroupQueryHandler from "../GroupQueryHandler"
import type OrderQueryHandler from "../OrderQueryHandler"
import type { JoinQueryOptions } from "../JoinQueryHandler"

export type FindQueryOptions<T extends EntityTarget> = {
    select?: SelectQueryHandler<T>
    where?: WhereQueryHandler<T>
    relations?: JoinQueryOptions<T>
    group?: GroupQueryHandler<T>
    order?: OrderQueryHandler<T>
    limit?: number
    offset?: number
}

export type SelectQueryFunction<T extends EntityTarget> = (
    (queryBuilder: SelectQueryHandler<T>) => void
)

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryHandler<T>) => void
)

export type JoinQueryFunction<T extends EntityTarget> = (
    (queryBuilder: JoinQueryHandler<T>) => void
)