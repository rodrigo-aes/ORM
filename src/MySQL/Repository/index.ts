import BaseEntity, {
    type Pagination
} from "../BaseEntity"

// SQL Builders
import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
} from "../QueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,

    type ResultMapOption,
    type DeleteResult,
} from "../Handlers"

// Types 
import type { EntityTarget, AsEntityTarget } from "../../types/General"
import type { UpdateQueryResult } from "./types"
import type { ResultSetHeader } from "mysql2"

export default class Repository<T extends EntityTarget> {
    constructor(
        public target: T
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findByPk(pk: any, mapTo: ResultMapOption = 'entity') {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindByPkSQLBuilder<AsEntityTarget<T>>(
                this.target as AsEntityTarget<T>,
                pk
            ),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

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
            new FindOneSQLBuilder(this.target, options),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public paginate(options: PaginationQueryOptions<InstanceType<T>>): (
        Promise<Pagination<InstanceType<T>>>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new PaginationSQLBuilder(this.target, options),
            'entity'
        )
            .exec() as Promise<Pagination<InstanceType<T>>>
    }

    // ------------------------------------------------------------------------

    public create(
        attributes: CreationAttributes<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder<AsEntityTarget<T>>(
                this.target as AsEntityTarget<T>,
                attributes
            ),
            mapTo
        )
            .exec() as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public createMany(
        attributes: CreationAttributes<InstanceType<T>>[],
        mapTo: ResultMapOption = 'entity'
    ): Promise<InstanceType<T>[]> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder<AsEntityTarget<T>>(
                this.target as AsEntityTarget<T>,
                attributes
            ),
            mapTo
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
        where: ConditionalQueryOptions<InstanceType<T>>,
    ): Promise<UpdateQueryResult<T, Data>> {
        const header: ResultSetHeader = await new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateSQLBuilder(this.target, attributes, where),
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
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateOrCreateSQLBuilder<AsEntityTarget<T>>(
                this.target as AsEntityTarget<T>,
                attributes as UpdateOrCreateAttibutes<EntityTarget>
            ),
            mapTo
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