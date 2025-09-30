import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types"

import type ConditionalQueryHandler from "../ConditionalQueryBuilder"

export type CaseQueryTuple<
    T extends EntityTarget | PolymorphicEntityTarget
> = [
        ConditionalQueryHandler<T>,
        any
    ]