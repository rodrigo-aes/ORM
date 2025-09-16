import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type SelectQueryBuilder from "../SelectQueryBuilder"
import type ConditionalQueryHandler from "../ConditionalQueryBuilder"
import type GroupQueryBuilder from "../GroupQueryBuilder"
import type { JoinQueryOptions } from "../JoinQueryBuilder"

export type FindOneQueryOptions<
    T extends EntityTarget | PolymorphicEntityTarget
> = {
    select?: SelectQueryBuilder<T>
    where?: ConditionalQueryHandler<T>
    relations?: JoinQueryOptions<T>
    group?: GroupQueryBuilder<T>

}