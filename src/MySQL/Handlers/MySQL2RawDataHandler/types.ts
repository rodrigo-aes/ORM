import type { EntityTarget, EntityUnionTarget } from "../../../types/General"

import type {
    EntityProperties,
    EntityRelations
} from "../../QueryBuilder"

export type MySQL2RawData = any
export type DataFillMethod = 'One' | 'Many'

export type RawData<T extends EntityTarget | EntityUnionTarget> = (
    EntityProperties<InstanceType<T>> &
    Partial<EntityRelations<InstanceType<T>>>
)

export type MappedDataType<
    T extends EntityTarget | EntityUnionTarget,
    M extends 'raw' | 'entity'
> = M extends 'raw'
    ? RawData<T>
    : M extends 'entity'
    ? InstanceType<T>
    : never 