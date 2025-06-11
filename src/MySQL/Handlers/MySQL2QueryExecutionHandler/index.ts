import { EntityMetadata } from "../../Metadata"

import BaseEntity from "../../BaseEntity"

// SQL Builders
import {
    FindSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder
} from "../../QueryBuilder"

// Handlers
import MySQL2RawDataHandler, {
    type MySQL2RawData,
    type DataFillMethod
} from "../MySQL2RawDataHandler"

import EntityBuilder from "../EntityBuilder"

// Types
import type { ResultSetHeader } from "mysql2"
import type MySQLConnection from "../../Connection"
import type { EntityTarget } from "../../../types/General"
import type {
    SQLBuilder,
    ExecResult,
    ResultMapOption,
    FindResult,
    CreateResult,
    UpdateResult,
    UpdateOrCreateResult,
    DeleteResult
} from "./types"

export default class MySQL2QueryExecutionHandler<
    T extends EntityTarget,
    Builder extends SQLBuilder<T>,
    MapTo extends ResultMapOption
> {
    protected metadata: EntityMetadata

    constructor(
        public target: T,
        public sqlBuilder: Builder,
        public mapTo: MapTo
    ) {
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public exec(): Promise<ExecResult<T, Builder, MapTo>> {
        if (this.sqlBuilder instanceof FindSQLBuilder) return (
            this.executeFind() as Promise<ExecResult<T, Builder, MapTo>>
        )

        else if (this.sqlBuilder instanceof CreateSQLBuilder) return (
            this.executeCreate() as Promise<ExecResult<T, Builder, MapTo>>
        )

        else if (this.sqlBuilder instanceof UpdateSQLBuilder) return (
            this.executeUpdate() as Promise<ExecResult<T, Builder, MapTo>>
        )

        else if (this.sqlBuilder instanceof UpdateOrCreateSQLBuilder) return (
            this.executeUpdateOrCreate() as (
                Promise<ExecResult<T, Builder, MapTo>>
            )
        )

        else if (this.sqlBuilder instanceof DeleteSQLBuilder) return (
            this.executeDelete() as Promise<ExecResult<T, Builder, MapTo>>
        )

        throw new Error
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // Privates ---------------------------------------------------------------
    private async executeFind(): Promise<FindResult<T, MapTo>> {
        const connection = this.getConnection()
        const mySQL2RawData = await connection.query(this.sqlBuilder.SQL())

        return this.handleDataMapTo(mySQL2RawData, 'Many') as (
            FindResult<T, MapTo>
        )
    }

    // ------------------------------------------------------------------------

    private async executeCreate(): Promise<CreateResult<T>> {
        const connection = this.getConnection()

        const resultHeader: ResultSetHeader = await connection.query(
            this.sqlBuilder.SQL(),
            (this.sqlBuilder as CreateSQLBuilder<T>).columnsValues
        ) as any

        return this.buildCreatedEntities(resultHeader) as CreateResult<T>
    }

    // ------------------------------------------------------------------------

    private async executeUpdate(): Promise<UpdateResult<T>> {
        const connection = this.getConnection()

        const resultHeader: ResultSetHeader = await connection.query(
            this.sqlBuilder.SQL()
        ) as any

        const isEntity = (this.sqlBuilder as UpdateSQLBuilder<T>)
            .attributes instanceof BaseEntity

        return isEntity
            ? (this.sqlBuilder as UpdateSQLBuilder<T>).attributes as (
                InstanceType<T>
            )
            : resultHeader
    }

    // ------------------------------------------------------------------------

    private async executeUpdateOrCreate(): (
        Promise<UpdateOrCreateResult<T>>
    ) {
        const connection = this.getConnection()
        const [mySQL2RawData] = await connection.query(this.sqlBuilder.SQL())

        return this.handleDataMapTo(mySQL2RawData, 'One') as (
            UpdateOrCreateResult<T>
        )
    }

    // ------------------------------------------------------------------------

    private async executeDelete(): Promise<DeleteResult> {
        const connection = this.getConnection()
        const { affectedRows, serverStatus }: ResultSetHeader = (
            await connection.query(this.sqlBuilder.SQL()) as any
        )

        return {
            affectedRows,
            serverStatus
        }
    }

    // ------------------------------------------------------------------------

    private buildCreatedEntities(resultHeader: ResultSetHeader): (
        ExecResult<T, Builder, MapTo>
    ) {
        return new EntityBuilder(
            this.target,
            (this.sqlBuilder as CreateSQLBuilder<T>).attributes!,
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
    ): (
            ExecResult<T, Builder, MapTo>
        ) {
        switch (this.mapTo) {
            case 'entity':
            case 'json':
                const handler = new MySQL2RawDataHandler(
                    this.target, fillMethod, rawData
                )

                switch (this.mapTo) {
                    case 'entity': return handler.parseEntity() as (
                        ExecResult<T, Builder, MapTo>
                    )

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
}

export {
    type ExecResult,
    type ResultMapOption,
    type FindResult,
    type CreateResult
}