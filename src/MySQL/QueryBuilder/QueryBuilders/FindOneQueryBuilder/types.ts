import type { EntityTarget } from "../../../../types/General"

import type SelectQueryBuilder from "../SelectQueryBuilder"
import type WhereQueryBuilder from "../WhereQueryBuilder"
import type JoinQueryBuilder from "../JoinQueryBuilder"
import type GroupQueryBuilder from "../GroupQueryBuilder"
import type { JoinQueryOptions } from "../JoinQueryBuilder"

export type FindOneQueryOptions<T extends EntityTarget> = {
    select?: SelectQueryBuilder<T>
    where?: WhereQueryBuilder<T>
    relations?: JoinQueryOptions<T>
    group?: GroupQueryBuilder<T>

}

export type SelectQueryFunction<T extends EntityTarget> = (
    (queryBuilder: SelectQueryBuilder<T>) => void
)

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryBuilder<T>) => void
)

export type JoinQueryFunction<T extends EntityTarget> = (
    (queryBuilder: JoinQueryBuilder<T>) => void
)