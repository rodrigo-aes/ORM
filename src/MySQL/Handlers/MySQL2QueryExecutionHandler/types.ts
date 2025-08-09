import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type { ResultSetHeader } from "mysql2"
import type { AsEntityTarget } from "../../../types/General"

import type {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder
} from "../../QueryBuilder"

import type { Collection } from "../../BaseEntity"

export type SQLBuilder<T extends EntityTarget | UnionEntityTarget> = (
    FindByPkSQLBuilder<T> |
    FindSQLBuilder<T> |
    FindOneSQLBuilder<T> |
    CreateSQLBuilder<AsEntityTarget<T>> |
    UpdateOrCreateSQLBuilder<AsEntityTarget<T>> |
    UpdateSQLBuilder<T> |
    DeleteSQLBuilder<T>
)

import type { MySQL2RawData, RawData } from "../MySQL2RawDataHandler"

export type ResultMapOption = 'entity' | 'json' | 'raw'

export type ExecOptions = {
    mapTo?: ResultMapOption
}

export type UnionExecResult<
    T extends EntityTarget | UnionEntityTarget,
    Builder extends SQLBuilder<T>,
    MapTo extends ResultMapOption
> = (
        Builder extends FindSQLBuilder<T>
        ? FindResult<T, MapTo>
        : Builder extends FindOneSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends UpdateSQLBuilder<T>
        ? UpdateResult<T>
        : Builder extends DeleteSQLBuilder<T>
        ? DeleteResult
        : never
    )

export type ExecResult<
    T extends EntityTarget | UnionEntityTarget,
    Builder extends SQLBuilder<T>,
    MapTo extends ResultMapOption
> = T extends EntityTarget
    ? (
        Builder extends FindSQLBuilder<T>
        ? FindResult<T, MapTo>
        : Builder extends FindOneSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends FindByPkSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends FindByPkSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends CreateSQLBuilder<T>
        ? CreateResult<T>
        : Builder extends UpdateSQLBuilder<T>
        ? UpdateResult<T>
        : Builder extends UpdateOrCreateSQLBuilder<T>
        ? UpdateOrCreateResult<T>
        : Builder extends DeleteSQLBuilder<T>
        ? DeleteResult
        : never
    )
    : UnionExecResult<T, Builder, MapTo>

export type FindOneResult<
    T extends EntityTarget | UnionEntityTarget,
    MapTo extends ResultMapOption
> = (
        MapTo extends 'entity'
        ? InstanceType<T> | null
        : MapTo extends 'json'
        ? RawData<T> | null
        : MapTo extends 'raw'
        ? MySQL2RawData[]
        : InstanceType<T>
    )

export type FindResult<
    T extends EntityTarget | UnionEntityTarget,
    MapTo extends ResultMapOption
> = (
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

export type UpdateResult<T extends EntityTarget | UnionEntityTarget> = (
    InstanceType<T> | ResultSetHeader
)

export type UpdateOrCreateResult<T extends EntityTarget> = (
    InstanceType<T>
)

export type DeleteResult = {
    affectedRows: number,
    serverStatus: number
}