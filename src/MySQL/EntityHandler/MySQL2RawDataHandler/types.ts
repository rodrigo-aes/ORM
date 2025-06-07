import type { EntityTarget } from "../../../types/General"

import type {
    EntityProperties,
    EntityRelations
} from "../../QueryBuilder"

export type MySQL2RawData = any

export type RawData<T extends EntityTarget> = (
    EntityProperties<InstanceType<T>> |
    Partial<EntityRelations<InstanceType<T>>>
)

export type MappedDataType<
    T extends EntityTarget, M extends 'raw' | 'entity'
> = M extends 'raw'
    ? RawData<T>
    : M extends 'entity'
    ? InstanceType<T>
    : never 