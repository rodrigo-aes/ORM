import type {
    EntityTarget,
    PolymorphicEntityTarget,
    EntityRelationsKeys
} from "../../types"

import type JoinQueryBuilder from "."
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"

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
    on?: ConditionalQueryBuilder<T>,
    relations?: JoinQueryOptions<T>
}
