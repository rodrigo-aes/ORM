import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

import type WhereQueryBuilder from "../WhereQueryBuilder"

export type CaseQueryTuple<
    T extends EntityTarget | PolymorphicEntityTarget
> = [
        WhereQueryBuilder<T>,
        any
    ]