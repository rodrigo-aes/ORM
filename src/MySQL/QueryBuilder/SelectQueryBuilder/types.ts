import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types/General"

import type { SelectPropertyKey } from "../../SQLBuilders"
import type CaseQueryBuilder from "../CaseQueryBuilder"
import type { CaseQueryHandler } from "../types"

export type SelectPropertyType<
    T extends EntityTarget | PolymorphicEntityTarget
> = (
        SelectPropertyKey<InstanceType<T>> |
        CaseQueryBuilder<T>
    )

export type SelectPropertiesOptions<
    T extends EntityTarget | PolymorphicEntityTarget
> = (
        SelectPropertyKey<InstanceType<T>> |
        CaseQueryHandler<T>
    )