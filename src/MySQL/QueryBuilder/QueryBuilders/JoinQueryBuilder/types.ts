import type { EntityTarget } from "../../../../types/General"
import type { EntityRelationsKeys } from "../../types"

import type JoinQueryBuilder from "."
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type WhereQueryBuilder from "../WhereQueryBuilder"

export type JoinQueryOptions<T extends EntityTarget> = Partial<{
    [K in EntityRelationsKeys<InstanceType<T>>]: (
        boolean |
        JoinQueryBuilder<any>
    )
}>

export type JoinQueryClause<T extends EntityTarget> = {
    required?: boolean
    select?: SelectQueryBuilder<T>,
    on?: WhereQueryBuilder<T>,
    relations?: JoinQueryOptions<T>
}

export type SelectQueryFunction<T extends EntityTarget> = (
    (queryBuilder: SelectQueryBuilder<T>) => void
)


export type OnQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryBuilder<T>) => void
)

export type JoinQueryFunction<T extends EntityTarget> = (
    (queryBuilder: JoinQueryBuilder<T>) => void
)