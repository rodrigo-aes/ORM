import type { EntityTarget } from "../../../types/General"
import type { ResultSetHeader } from "mysql2"

import type {
    FindSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder
} from "../../QueryBuilder"

import type { Collection } from "../../BaseEntity"

export type SQLBuilder<T extends EntityTarget> = (
    FindSQLBuilder<T> |
    CreateSQLBuilder<T> |
    UpdateSQLBuilder<T> |
    UpdateOrCreateSQLBuilder<T>
)

import type { MySQL2RawData, RawData } from "../MySQL2RawDataHandler"

export type ResultMapOption = 'entity' | 'json' | 'raw'

export type ExecOptions = {
    mapTo?: ResultMapOption
}

export type ExecResult<
    T extends EntityTarget,
    Builder extends SQLBuilder<T>,
    MapTo extends ResultMapOption
> = (
        Builder extends FindSQLBuilder<T>
        ? FindResult<T, MapTo>
        : Builder extends CreateSQLBuilder<T>
        ? CreateResult<T>
        : Builder extends UpdateSQLBuilder<T>
        ? UpdateResult<T>
        : Builder extends UpdateOrCreateSQLBuilder<T>
        ? UpdateOrCreateResult<T>
        : never
    )

export type FindResult<T extends EntityTarget, MapTo extends ResultMapOption> = (
    MapTo extends 'entity'
    ? Collection<InstanceType<T>>
    : MapTo extends 'json'
    ? RawData<T>[]
    : MapTo extends 'raw'
    ? MySQL2RawData[]
    : Collection<InstanceType<T>>
)

export type CreateResult<T extends EntityTarget> = (
    InstanceType<T> | Collection<InstanceType<T>>
)

export type UpdateResult<T extends EntityTarget> = (
    InstanceType<T> | Collection<InstanceType<T>> | ResultSetHeader
)

export type UpdateOrCreateResult<T extends EntityTarget> = (
    InstanceType<T> | Collection<InstanceType<T>>
)