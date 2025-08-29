import { EntityMetadata } from "../Metadata"

import TableSchema, {
    ColumnSchema,
    ColumnSchemaInitMap
} from "./TableSchema"

import TriggersSchema from "./TriggersSchema"

// Statics 
import { databaseSchemaQuery } from "./static"

// Types
import type MySQLConnection from "../Connection"
import type { TableSchemaInitMap } from "./types"

export default class DatabaseSchema extends Array<TableSchema> {
    private previous?: DatabaseSchema
    private triggers?: TriggersSchema

    constructor(
        public connection: MySQLConnection,
        ...tables: (TableSchema | TableSchemaInitMap)[]
    ) {
        super(...tables.map(table => table instanceof TableSchema
            ? table
            : new TableSchema(
                table.tableName,
                ...table.columns
            )
        ))

        this.orderByDependencies()
    }

    static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async reset(): Promise<void> {
        (await this.previuosSchema()).dropAll()
        await this.crateAll()
    }

    // ------------------------------------------------------------------------

    public async alter(): Promise<void> {
        await this.dropInexistents()

        for (const table of this) await table.executeAction(
            this.connection,
            (await this.previuosSchema()).findTable(table.name)
        )

        await this.triggersSchema().alter()
    }

    // ------------------------------------------------------------------------

    public async crateAll(): Promise<void> {
        for (const table of this) await table.create(this.connection)
        await this.triggersSchema().createAll()
    }

    // ------------------------------------------------------------------------

    public async dropAll(): Promise<void> {
        await this.triggersSchema().dropAll()

        for (const table of (await this.previuosSchema()).reverse()) (
            await table.drop(this.connection)
        )
    }

    // ------------------------------------------------------------------------

    public findTable(name: string): TableSchema | undefined {
        return this.find(t => t.name === name)
    }

    // Privates ---------------------------------------------------------------
    private orderByDependencies(): this {
        return this.sort((a, b) => a.dependencies.includes(b.name) ? 1 : -1)
    }

    // ------------------------------------------------------------------------

    private async previuosSchema(): Promise<DatabaseSchema> {
        if (this.previous) return this.previous

        this.previous = new DatabaseSchema(
            this.connection,
            ...(await this.connection.query(databaseSchemaQuery, undefined, {
                logging: false
            }))
        )

        return this.previous
    }

    // ------------------------------------------------------------------------

    private triggersSchema(): TriggersSchema {
        if (this.triggers) return this.triggers

        this.triggers = TriggersSchema.buildFromMetadatas(
            this.connection,
            ...this.connection.entities.flatMap(
                target => {
                    const meta = EntityMetadata.findOrBuild(target)
                    return meta.triggers ? [meta.triggers] : []
                }
            )
        )

        return this.triggers
    }

    // ------------------------------------------------------------------------

    private async dropInexistents(): Promise<void> {
        for (const table of (await this.previuosSchema()).filter(
            ({ name }) => !this.findTable(name)
        )) (
            await table.drop(this.connection)
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromConnectionMetadata(connection: MySQLConnection) {
        const included = new Set<string>()

        return new DatabaseSchema(
            connection,
            ...connection.entities.flatMap(target => {
                const meta = EntityMetadata.find(target)
                if (!meta) throw new Error

                return [
                    TableSchema.buildFromMetadata(meta),
                    ...TableSchema.buildJoinTablesFromMetadata(meta)
                ]
            })
                .filter(({ name }) => {
                    if (included.has(name)) return false

                    included.add(name)
                    return true
                }),
        )
    }
}

export {
    TableSchema,
    ColumnSchema,
    TriggersSchema,

    type ColumnSchemaInitMap
}