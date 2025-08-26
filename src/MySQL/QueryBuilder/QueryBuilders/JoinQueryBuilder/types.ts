import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"
import type { EntityRelationsKeys } from "../../types"

import type JoinQueryBuilder from "."
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type WhereQueryBuilder from "../WhereQueryBuilder"

export type JoinQueryOptions<
    T extends EntityTarget | PolymorphicEntityTarget
> = Partial<{
    [K in EntityRelationsKeys<InstanceType<T>>]: (
        boolean |
        JoinQueryBuilder<any>
    )
}>

export type JoinQueryClause<
    T extends EntityTarget | PolymorphicEntityTarget
> = {
    required?: boolean
    select?: SelectQueryBuilder<T>,
    on?: WhereQueryBuilder<T>,
    relations?: JoinQueryOptions<T>
}
