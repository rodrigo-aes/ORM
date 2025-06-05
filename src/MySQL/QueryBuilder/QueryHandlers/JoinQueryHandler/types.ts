import type { EntityTarget } from "../../../../types/General"
import type { EntityRelationsKeys } from "../../types"

import type JoinQueryHandler from "."
import type SelectQueryHandler from "../SelectQueryHandler"
import type WhereQueryHandler from "../WhereQueryHandler"

export type JoinQueryOptions<T extends EntityTarget> = Partial<{
    [K in EntityRelationsKeys<InstanceType<T>>]: (
        boolean |
        JoinQueryHandler<any>
    )
}>

export type JoinQueryClause<T extends EntityTarget> = {
    required?: boolean
    select?: SelectQueryHandler<T>,
    on?: WhereQueryHandler<T>,
    relations?: JoinQueryOptions<T>
}

export type SelectQueryFunction<T extends EntityTarget> = (
    (queryBuilder: SelectQueryHandler<T>) => void
)


export type OnQueryFunction<T extends EntityTarget> = (
    (queryBuilder: WhereQueryHandler<T>) => void
)

export type JoinQueryFunction<T extends EntityTarget> = (
    (queryBuilder: JoinQueryHandler<T>) => void
)