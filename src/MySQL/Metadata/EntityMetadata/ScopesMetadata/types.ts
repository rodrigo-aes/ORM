import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

import { FindQueryOptions } from "../../../QueryBuilder"

export type ScopeFunction<T extends EntityTarget | PolymorphicEntityTarget = any> = (
    (...args: any[]) => FindQueryOptions<InstanceType<T>>
)

export type Scope<T extends EntityTarget | PolymorphicEntityTarget = any> = (
    FindQueryOptions<InstanceType<T>> |
    ScopeFunction<T>
)