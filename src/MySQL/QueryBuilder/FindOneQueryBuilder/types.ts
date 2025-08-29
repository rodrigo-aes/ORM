import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type SelectQueryBuilder from "../SelectQueryBuilder"
import type WhereQueryBuilder from "../WhereQueryBuilder"
import type GroupQueryBuilder from "../GroupQueryBuilder"
import type { JoinQueryOptions } from "../JoinQueryBuilder"

export type FindOneQueryOptions<
    T extends EntityTarget | PolymorphicEntityTarget
> = {
    select?: SelectQueryBuilder<T>
    where?: WhereQueryBuilder<T>
    relations?: JoinQueryOptions<T>
    group?: GroupQueryBuilder<T>

}