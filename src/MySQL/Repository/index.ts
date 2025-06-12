import { EntityMetadata } from "../Metadata"
import BaseEntity from "../BaseEntity"

// SQL Builders
import {
    FindSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,

    type FindQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
} from "../QueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,

    type ResultMapOption,
    type DeleteResult
} from "../Handlers"

// Types 
import type { EntityTarget } from "../../types/General"
import type { FindOneQueryOptions, UpdateQueryResult } from "./types"
import type { ResultSetHeader } from "mysql2"

export default class Repository<T extends EntityTarget> {
    constructor(
        public target: T
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public find(
        options: FindQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindSQLBuilder(this.target, options),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public findOne(
        options: FindOneQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindSQLBuilder(this.target, {
                ...options,
                limit: 1
            }),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public create(attributes: CreationAttributes<InstanceType<T>>): (
        Promise<InstanceType<T>>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder(this.target, attributes),
            'entity'
        )
            .exec() as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public createMany(attributes: CreationAttributes<InstanceType<T>>[]): (
        Promise<InstanceType<T>[]>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder(this.target, attributes),
            'entity'
        )
            .exec() as (
                Promise<InstanceType<T>[]>
            )
    }

    // ------------------------------------------------------------------------

    public async update<Data extends (
        (BaseEntity & InstanceType<T>) |
        UpdateAttributes<InstanceType<T>>
    )>(
        attributes: Data,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): Promise<UpdateQueryResult<T, Data>> {
        const header: ResultSetHeader = await new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateSQLBuilder(
                this.target,
                attributes,
                where
            ),
            'raw'
        )
            .exec() as any

        return (
            attributes instanceof BaseEntity
                ? attributes
                : header
        ) as (
                UpdateQueryResult<T, Data>
            )
    }

    // ------------------------------------------------------------------------

    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateOrCreateSQLBuilder(this.target, attributes),
            'entity'
        )
            .exec() as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public delete(where: ConditionalQueryOptions<InstanceType<T>>): (
        Promise<DeleteResult>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new DeleteSQLBuilder(this.target, where),
            'raw'
        )
            .exec() as (
                Promise<DeleteResult>
            )
    }
}

export {
    type FindQueryOptions,
    type FindOneQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
    type ResultMapOption,
    type DeleteResult,
}