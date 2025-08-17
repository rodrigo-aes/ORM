import { MetadataHandler, type PolymorphicEntityMetadata } from "../Metadata"

// SQL Builders
import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
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
import type {
    PolymorphicEntityTarget,
    EntityTarget,
} from "../../types/General"

import type {
    CreateQueryResult,
    UpdateQueryResult,
    UpdateOrCreateQueryResult
} from "./types"

export default class PolymorphicRespository<
    T extends PolymorphicEntityTarget
> {
    constructor(public target: T) { }

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

    public create<
        Source extends EntityTarget,
        MapTo extends 'this' | 'source' = 'this'
    >(
        source: Source,
        attributes: (
            CreationAttributes<InstanceType<Source>> |
            InstanceType<T>
        ),
        mapTo?: MapTo
    ): Promise<CreateQueryResult<T, Source, MapTo>> {
        return new MySQL2QueryExecutionHandler(
            source,
            new CreateSQLBuilder(source, attributes as any) as any,
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<CreateQueryResult<T, Source, MapTo>>
    }

    // ------------------------------------------------------------------------

    public update<
        Source extends EntityTarget,
        Data extends InstanceType<T> | UpdateAttributes<Source>
    >(
        source: Source,
        attributes: Data,
        where?: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<UpdateQueryResult<T, Source, Data>> {
        return new MySQL2QueryExecutionHandler(
            source,
            new UpdateSQLBuilder(
                source,
                attributes as UpdateAttributes<InstanceType<Source>>,
                where as ConditionalQueryOptions<InstanceType<Source>>
            ),
            'raw'
        )
            .exec() as Promise<UpdateQueryResult<T, Source, Data>>
    }

    // ------------------------------------------------------------------------

    public updateOrCreate<
        Source extends EntityTarget,
        MapTo extends 'this' | 'source' = 'this'
    >(
        source: Source,
        attributes: UpdateOrCreateAttibutes<InstanceType<Source>>,
        mapTo?: MapTo
    ): Promise<UpdateOrCreateQueryResult<T, Source, MapTo>> {
        return new MySQL2QueryExecutionHandler(
            source,
            new UpdateOrCreateSQLBuilder<any>(
                source,
                attributes
            ),
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<UpdateOrCreateQueryResult<T, Source, MapTo>>
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