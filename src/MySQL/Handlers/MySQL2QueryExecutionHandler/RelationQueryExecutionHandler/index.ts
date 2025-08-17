// Handlers
import {
    MetadataHandler,

    type EntityMetadata,
    type PolymorphicEntityMetadata
} from "../../../Metadata"

import MySQL2RawDataHandler, {
    type DataFillMethod
} from "../../MySQL2RawDataHandler"

import EntityBuilder from "../../EntityBuilder"

// Types
import type { ResultSetHeader } from "mysql2"
import type MySQLConnection from "../../../Connection"
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

import type { Collection } from "../../../BaseEntity"

import type {
    CreationAttributes,
    CreationAttributesOptions
} from "../../../QueryBuilder"

import type { MySQL2RawData } from "../../MySQL2RawDataHandler"
import type { DeleteResult } from "../types"

export default class RelationQueryExecutionHandler<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

    constructor(public target: T) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async executeFindOne(sql: string): Promise<InstanceType<T> | null> {
        return this
            .rawDataHandler('One', await this.getConnection().query(sql))
            .parseEntity() as InstanceType<T> | null
    }

    // ------------------------------------------------------------------------

    public async executeFind(sql: string): (
        Promise<Collection<InstanceType<T>>>
    ) {
        return this
            .rawDataHandler('Many', await this.getConnection().query(sql))
            .parseEntity() as Collection<InstanceType<T>>
    }

    // ------------------------------------------------------------------------

    public async executeCreate(
        sql: [string, any[]],
        attributes: CreationAttributes<InstanceType<T>>
    ): Promise<InstanceType<T>> {
        const resultHeader: ResultSetHeader = await this.getConnection()
            .query(...sql) as any

        return this.entityBuilder(
            attributes,
            resultHeader.insertId
        )
            .build() as (
                InstanceType<T>
            )
    }

    // ------------------------------------------------------------------------

    public async executeCreateMany(
        sql: [string, any[][]],
        attributes: CreationAttributes<InstanceType<T>>[]
    ): Promise<Collection<InstanceType<T>>> {
        const resultHeader: ResultSetHeader = await this.getConnection()
            .query(...sql) as any

        return this.entityBuilder(
            attributes,
            resultHeader.insertId
        )
            .build() as (
                Collection<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    public async executeUpdateOrCreate(
        sql: string,
    ): Promise<InstanceType<T>> {
        const [mySQL2RawData] = await this.getConnection().query(sql)

        return this
            .rawDataHandler('One', mySQL2RawData)
            .parseEntity(mySQL2RawData) as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    public async executeUpdate(sql: string): Promise<ResultSetHeader> {
        return await this.getConnection().query(sql) as any
    }

    // ------------------------------------------------------------------------

    public async executeDelete(sql: string): Promise<DeleteResult> {
        const { affectedRows, serverStatus }: ResultSetHeader = (
            await this.getConnection().query(sql) as any
        )

        return { affectedRows, serverStatus }
    }

    // ------------------------------------------------------------------------

    public async executeVoidOperation(sql: string, values?: any[]): (
        Promise<void>
    ) {
        await this.getConnection().query(sql, values)
    }

    // Privates ---------------------------------------------------------------
    private getConnection(): MySQLConnection {
        if (!this.metadata.connection) throw new Error
        return this.metadata.connection
    }

    // ------------------------------------------------------------------------

    private rawDataHandler(
        fillMethod: DataFillMethod,
        rawData: MySQL2RawData
    ): (
            MySQL2RawDataHandler<T>
        ) {
        return new MySQL2RawDataHandler(
            this.target,
            fillMethod,
            rawData
        )
    }

    // ------------------------------------------------------------------------

    private entityBuilder(
        attributes: CreationAttributesOptions<InstanceType<T>>,
        primary: any | undefined
    ): EntityBuilder<T> {
        return new EntityBuilder(
            this.target,
            attributes,
            primary
        )
    }
}