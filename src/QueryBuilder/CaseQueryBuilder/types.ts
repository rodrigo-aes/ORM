import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types"

import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"

export type CaseQueryTuple<
    T extends EntityTarget | PolymorphicEntityTarget
> = [
        ConditionalQueryBuilder<T>,
        any
    ]