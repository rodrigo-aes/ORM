import { MetadataHandler, type PolymorphicEntityMetadata } from "../Metadata"
import BasePolymorphicEntity from "../BasePolymorphicEntity"

// SQL Builders
import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CountSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
} from "../SQLBuilders"

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
} from "../types/General"

import type {
    CountManyQueryResult,
    CreateQueryResult,
    UpdateQueryResult,
    UpdateOrCreateQueryResult
} from "./types"

import type { Pagination } from "../BaseEntity"

export default class PolymorphicRepository<
    T extends PolymorphicEntityTarget
> {
    protected metadata: PolymorphicEntityMetadata

    constructor(public target: T) {
        this.metadata = MetadataHandler.loadMetadata(this.target) as (
            PolymorphicEntityMetadata
        )
    }

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

    public async count(options: CountQueryOption<InstanceType<T>>) {
        return (
            await new MySQL2QueryExecutionHandler(
                this.target,
                CountSQLBuilder.countBuilder(
                    this.target,
                    options
                ),
                'json'
            )
                .exec()
        )
            .result
    }

    // ------------------------------------------------------------------------

    public countMany<Opts extends CountQueryOptions<InstanceType<T>>>(
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            CountSQLBuilder.countManyBuilder(
                this.target,
                options
            ),
            'json'
        )
            .exec() as Promise<CountManyQueryResult<T, Opts>>
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
        this.verifySource(source)

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

    public createMany<
        Source extends EntityTarget,
        MapTo extends 'this' | 'source' = 'this'
    >(
        source: Source,
        attributes: CreationAttributes<InstanceType<Source>>[],
        mapTo?: MapTo
    ): Promise<CreateQueryResult<T, Source, MapTo>[]> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new CreateSQLBuilder(source, attributes as any) as any,
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<CreateQueryResult<T, Source, MapTo>[]>
    }

    // ------------------------------------------------------------------------

    public update<
        Source extends EntityTarget,
        Data extends InstanceType<T> | UpdateAttributes<InstanceType<Source>>
    >(
        source: Source,
        attributes: Data,
        where?: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<UpdateQueryResult<T, Source, Data>> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new UpdateSQLBuilder(
                source,
                attributes instanceof BasePolymorphicEntity
                    ? attributes.toSourceEntity()
                    : attributes,
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
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new UpdateOrCreateSQLBuilder<any>(source, attributes),
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<UpdateOrCreateQueryResult<T, Source, MapTo>>
    }

    // ------------------------------------------------------------------------

    public delete<Source extends EntityTarget>(
        source: Source,
        where: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<DeleteResult> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new DeleteSQLBuilder(source, where),
            'raw'
        )
            .exec() as (
                Promise<DeleteResult>
            )
    }

    // Privates ---------------------------------------------------------------
    private verifySource(source: EntityTarget): void {
        if (!this.metadata.entities[source.name]) throw new Error
    }
}

export {
    type FindQueryOptions,
    type FindOneQueryOptions,
    type CountManyQueryResult,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
    type ResultMapOption,
    type DeleteResult,
}