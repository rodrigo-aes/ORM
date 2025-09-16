import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type { EntityRelationsKeys } from "../../SQLBuilders"

import type JoinQueryBuilder from "."
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type ConditionalQueryHandler from "../ConditionalQueryBuilder"

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
    on?: ConditionalQueryHandler<T>,
    relations?: JoinQueryOptions<T>
}
