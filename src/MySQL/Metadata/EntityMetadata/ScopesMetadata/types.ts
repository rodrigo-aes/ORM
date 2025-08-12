import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../types/General"

import { FindQueryOptions } from "../../../QueryBuilder"

export type ScopeFunction<T extends EntityTarget | EntityUnionTarget = any> = (
    (...args: any[]) => FindQueryOptions<InstanceType<T>>
)

export type Scope<T extends EntityTarget | EntityUnionTarget = any> = (
    FindQueryOptions<InstanceType<T>> |
    ScopeFunction<T>
)