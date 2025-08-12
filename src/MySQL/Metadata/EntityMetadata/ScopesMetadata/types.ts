import type {
    EntityTarget,
    UnionEntityTarget
} from "../../../../types/General"

import { FindQueryOptions } from "../../../QueryBuilder"

export type ScopeFunction<T extends EntityTarget | UnionEntityTarget = any> = (
    (...args: any[]) => FindQueryOptions<InstanceType<T>>
)

export type Scope<T extends EntityTarget | UnionEntityTarget = any> = (
    FindQueryOptions<InstanceType<T>> |
    ScopeFunction<T>
)