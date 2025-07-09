import BaseEntity from "../BaseEntity"
import BaseEntityUnion from "../BaseEntityUnion"


// SQL Builders
import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    UpdateSQLBuilder,
    DeleteSQLBuilder,

    type FindOneQueryOptions,
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
    type DeleteResult,
} from "../Handlers"

// Types 
import type { UnionEntityTarget } from "../../types/General"
import type { UpdateQueryResult } from "./types"
import type { ResultSetHeader } from "mysql2"

export default class UnionRepository<T extends UnionEntityTarget> {
    constructor(
        public target: T
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public findByPk(pk: any, mapTo: ResultMapOption = 'entity') {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindByPkSQLBuilder<T>(
                this.target,
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

    public async update<Data extends (
        (BaseEntityUnion<any> & InstanceType<T>) |
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