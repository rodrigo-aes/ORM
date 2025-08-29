import { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"
import BaseEntity, { type PaginationInitMap } from "../../BaseEntity"

// Childs
import RelationQueryExecutionHandler from "./RelationQueryExecutionHandler"

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
    UpdateAttributes,
    ConditionalQueryOptions,
} from "../../SQLBuilders"

// Handlers
import { MetadataHandler } from "../../Metadata"
import MySQL2RawDataHandler, {
    type MySQL2RawData,
    type DataFillMethod
} from "../MySQL2RawDataHandler"

import EntityBuilder from "../EntityBuilder"

// Types
import type { ResultSetHeader } from "mysql2"
import type MySQLConnection from "../../Connection"
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    AsEntityTarget
} from "../../../types/General"
import type {
    SQLBuilder,
    ExecResult,
    ResultMapOption,
    FindOneResult,
    FindResult,
    PaginateResult,
    CountResult,
    CreateResult,
    UpdateResult,
    UpdateOrCreateResult,
    DeleteResult,
} from "./types"

export default class MySQL2QueryExecutionHandler<
    T extends EntityTarget | PolymorphicEntityTarget,
    Builder extends SQLBuilder<T>,
    MapTo extends ResultMapOption
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    private pagination?: PaginationInitMap

    constructor(
        public target: T,
        public sqlBuilder: Builder,
        public mapTo: MapTo
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public exec(): Promise<ExecResult<T, Builder, MapTo>> {
        switch (true) {
            case this.sqlBuilder instanceof FindByPkSQLBuilder: return (
                this.executeFindByPk() as (
                    Promise<ExecResult<T, Builder, MapTo>>
                )
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof PaginationSQLBuilder: return (
                this.executePaginate() as (
                    Promise<ExecResult<T, Builder, MapTo>>
                )
            )


            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof FindSQLBuilder: return (
                this.executeFind() as Promise<ExecResult<T, Builder, MapTo>>
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof FindOneSQLBuilder: return (
                this.executeFindOne() as (
                    Promise<ExecResult<T, Builder, MapTo>>
                )
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof CountSQLBuilder: return (
                this.executeCount() as Promise<ExecResult<T, Builder, MapTo>>
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof CreateSQLBuilder: return (
                this.executeCreate() as Promise<ExecResult<T, Builder, MapTo>>
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof UpdateSQLBuilder: return (
                this.executeUpdate() as Promise<ExecResult<T, Builder, MapTo>>
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof UpdateOrCreateSQLBuilder: return (
                this.executeUpdateOrCreate() as (
                    Promise<ExecResult<T, Builder, MapTo>>
                )
            )

            // ----------------------------------------------------------------

            case this.sqlBuilder instanceof DeleteSQLBuilder: return (
                this.executeDelete() as Promise<ExecResult<T, Builder, MapTo>>
            )

            // ----------------------------------------------------------------

            default: throw new Error
        }
    }

    // Privates ---------------------------------------------------------------
    private async executeFindByPk(): Promise<FindOneResult<T, MapTo>> {
        const connection = this.getConnection()
        const mySQL2RawData = await connection.query(this.sqlBuilder.SQL())

        return this.handleDataMapTo(mySQL2RawData, 'One') as (
            FindOneResult<T, MapTo>
        )
    }

    // ------------------------------------------------------------------------

    private async executeFindOne(): Promise<FindOneResult<T, MapTo>> {
        await this.callBeforeFindHook()

        const connection = this.getConnection();
        const mySQL2RawData = await connection.query(this.sqlBuilder.SQL())
        const result = this.handleDataMapTo(mySQL2RawData, 'One') as (
            FindOneResult<T, MapTo>
        )

        await this.callAfterFindHook(result)

        return result
    }

    // ------------------------------------------------------------------------

    private async executeFind(): Promise<FindResult<T, MapTo>> {
        await this.callBeforeBulkFindHook()

        const connection = this.getConnection()
        const mySQL2RawData = await connection.query(this.sqlBuilder.SQL())
        const result = this.handleDataMapTo(mySQL2RawData, 'Many') as (
            FindResult<T, MapTo>
        )

        await this.callAfterBulkFindHook(result)

        return result
    }

    // ------------------------------------------------------------------------

    private async executePaginate(): Promise<PaginateResult<T>> {
        await this.callBeforeBulkFindHook()

        const connection = this.getConnection()
        const [{ total }] = await connection.query(
            (this.sqlBuilder as PaginationSQLBuilder<T>).totalSQL()
        )
        const mySQL2RawData = await connection.query(this.sqlBuilder.SQL())

        this.pagination = {
            page: (this.sqlBuilder as PaginationSQLBuilder<T>).page,
            perPage: (this.sqlBuilder as PaginationSQLBuilder<T>).perPage,
            total
        }

        const result = this.handleDataMapTo(mySQL2RawData, 'Paginate') as (
            PaginateResult<T>
        )

        await this.callAfterBulkFindHook(result)

        return result
    }

    // ------------------------------------------------------------------------

    private async executeCount(): Promise<CountResult> {
        const connection = this.getConnection()
        const [result] = await connection.query(this.sqlBuilder.SQL())
        return result
    }

    // ------------------------------------------------------------------------

    private async executeCreate(): (
        Promise<CreateResult<Extract<T, EntityTarget>>>
    ) {
        this.callBeforeCreateHook()

        const connection = this.getConnection()

        const resultHeader: ResultSetHeader = await connection.query(
            this.sqlBuilder.SQL(),
            (this.sqlBuilder as CreateSQLBuilder<Extract<T, EntityTarget>>)
                .columnsValues
        ) as any

        const result = this.buildCreatedEntities(resultHeader) as (
            CreateResult<Extract<T, EntityTarget>>
        )

        await this.callAfterCreateHook(result)

        return result
    }

    // ------------------------------------------------------------------------

    private async executeUpdate(): Promise<UpdateResult<T>> {
        const isEntity = (this.sqlBuilder as UpdateSQLBuilder<T>)
            .attributes instanceof BaseEntity

        this.callBeforeUpdateHook(isEntity)

        const connection = this.getConnection()
        const resultHeader: ResultSetHeader = await connection.query(
            this.sqlBuilder.SQL()
        ) as any

        const result = isEntity
            ? (this.sqlBuilder as UpdateSQLBuilder<T>).attributes as (
                InstanceType<T>
            )
            : resultHeader

        this.callAfterUpdateHook(result)

        return result
    }

    // ------------------------------------------------------------------------

    private async executeUpdateOrCreate(): (
        Promise<UpdateOrCreateResult<Extract<T, EntityTarget>>>
    ) {
        const connection = this.getConnection()
        const [mySQL2RawData] = await connection.query(this.sqlBuilder.SQL())

        return this.handleDataMapTo(mySQL2RawData, 'One') as (
            UpdateOrCreateResult<Extract<T, EntityTarget>>
        )
    }

    // ------------------------------------------------------------------------

    private async executeDelete(): Promise<DeleteResult> {
        this.callBeforeDeleteHook()

        const connection = this.getConnection()
        const { affectedRows, serverStatus }: ResultSetHeader = (
            await connection.query(this.sqlBuilder.SQL()) as any
        )
        const result = { affectedRows, serverStatus }

        this.callAfterDeleteHook(result)

        return result
    }

    // ------------------------------------------------------------------------

    private buildCreatedEntities(resultHeader: ResultSetHeader): (
        ExecResult<T, Builder, MapTo>
    ) {
        return new EntityBuilder(
            this.target,
            (this.sqlBuilder as CreateSQLBuilder<Extract<T, EntityTarget>>)
                .attributes!,
            resultHeader.insertId ?? undefined
        )
            .build() as (
                ExecResult<T, Builder, MapTo>
            )
    }

    // ------------------------------------------------------------------------

    private handleDataMapTo(
        rawData: MySQL2RawData,
        fillMethod: DataFillMethod
    ): ExecResult<T, Builder, MapTo> {
        switch (this.mapTo) {
            case 'entity':
            case 'json':
                const handler = new MySQL2RawDataHandler(
                    this.target, fillMethod, rawData
                )

                switch (this.mapTo) {
                    case 'entity': return handler.parseEntity(
                        undefined,
                        this.pagination
                    ) as ExecResult<T, Builder, MapTo>

                    case 'json': return handler.parseRaw() as (
                        ExecResult<T, Builder, MapTo>
                    )
                }

            case 'raw': return rawData as ExecResult<T, Builder, MapTo>
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    private getConnection(): MySQLConnection {
        if (!this.metadata.connection) throw new Error
        return this.metadata.connection
    }

    // ------------------------------------------------------------------------

    private async callBeforeFindHook(): Promise<void> {
        await this.metadata.hooks?.callBeforeFind(
            (this.sqlBuilder as FindOneSQLBuilder<T>).options
        )
    }

    // ------------------------------------------------------------------------

    private async callAfterFindHook(result: FindOneResult<T, MapTo>): (
        Promise<void>
    ) {
        if (result) await this.metadata.hooks?.callAfterFind(result)
    }

    // ------------------------------------------------------------------------

    private async callBeforeBulkFindHook(): Promise<void> {
        await this.metadata.hooks?.callBeforeBulkFind(
            (this.sqlBuilder as FindOneSQLBuilder<T>).options
        )
    }

    // ------------------------------------------------------------------------

    private async callAfterBulkFindHook(result: any[]): (
        Promise<void>
    ) {
        if (result) await this.metadata.hooks?.callAfterBulkFind(result)
    }

    // ------------------------------------------------------------------------

    private async callBeforeCreateHook(): Promise<void> {
        await (
            Array.isArray(
                (this.sqlBuilder as CreateSQLBuilder<AsEntityTarget<T>>)
                    .attributes
            )
                ? this.metadata.hooks?.callBeforeBulkCreate(
                    (this.sqlBuilder as CreateSQLBuilder<AsEntityTarget<T>>)
                        .attributes as any
                )
                : this.metadata.hooks?.callBeforeCreate(
                    (this.sqlBuilder as CreateSQLBuilder<AsEntityTarget<T>>)
                        .attributes as any
                )
        )
    }

    // ------------------------------------------------------------------------

    private async callAfterCreateHook(
        result: CreateResult<Extract<T, EntityTarget>>
    ): Promise<void> {
        await (
            Array.isArray(result)
                ? this.metadata.hooks?.callAfterBulkCreate(result)
                : this.metadata.hooks?.callAfterCreate(result)
        )
    }

    // ------------------------------------------------------------------------

    private async callBeforeUpdateHook(single: boolean): Promise<void> {
        await (
            single
                ? this.metadata.hooks?.callBeforeUpdate(
                    (this.sqlBuilder as UpdateSQLBuilder<T>).attributes,
                    (this.sqlBuilder as UpdateSQLBuilder<T>).conditional
                )

                : this.metadata.hooks?.callBeforeBulkUpdate(
                    (this.sqlBuilder as UpdateSQLBuilder<T>).attributes as (
                        UpdateAttributes<InstanceType<T>>
                    ),
                    (this.sqlBuilder as UpdateSQLBuilder<T>).conditional
                )
        )
    }

    // ------------------------------------------------------------------------

    private async callAfterUpdateHook(
        result: InstanceType<T> | ResultSetHeader
    ): Promise<void> {
        await (
            result instanceof BaseEntity
                ? this.metadata.hooks?.callAfterUpdate(result)
                : this.metadata.hooks?.callAfterBulkUpdate(
                    (this.sqlBuilder as UpdateSQLBuilder<T>).conditional,
                    result as ResultSetHeader
                )
        )
    }

    // ------------------------------------------------------------------------

    private async callBeforeDeleteHook(): Promise<void> {
        await (
            (this.sqlBuilder as DeleteSQLBuilder<T>)
                .where instanceof BaseEntity

                ? this.metadata.hooks?.callBeforeDelete(
                    (this.sqlBuilder as DeleteSQLBuilder<T>).where
                )

                : this.metadata.hooks?.callBeforeBulkDelete(
                    (this.sqlBuilder as DeleteSQLBuilder<T>).where as (
                        ConditionalQueryOptions<InstanceType<T>>
                    )
                )
        )
    }

    // ------------------------------------------------------------------------

    private async callAfterDeleteHook(
        result: DeleteResult
    ): Promise<void> {
        await (
            (this.sqlBuilder as DeleteSQLBuilder<T>)
                .where instanceof BaseEntity

                ? this.metadata.hooks?.callAfterDelete(
                    (this.sqlBuilder as DeleteSQLBuilder<T>)
                        .where,
                    result,
                )

                : this.metadata.hooks?.callAfterBulkDelete(
                    (this.sqlBuilder as DeleteSQLBuilder<T>)
                        .where as ConditionalQueryOptions<InstanceType<T>>,
                    result,
                )
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static relation<T extends EntityTarget | PolymorphicEntityTarget>(
        related: T
    ): RelationQueryExecutionHandler<T> {
        return new RelationQueryExecutionHandler(related)
    }
}

export {
    type ExecResult,
    type ResultMapOption,
    type FindOneResult,
    type FindResult,
    type PaginateResult,
    type CountResult,
    type CreateResult,
    type DeleteResult,

    type RelationQueryExecutionHandler
}