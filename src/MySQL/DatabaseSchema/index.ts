import { EntityMetadata } from "../Metadata"

import TableSchema, {
    ColumnSchema,

    type ColumnSchemaInitMap,
    type ColumnPropertiesMap,
    type ForeignKeyReferencesSchema,
    type TableSchemaInitMap
} from "./TableSchema"

import TriggersSchema, {
    TriggerSchema
} from "./TriggersSchema"

// Statics 
import { databaseSchemaQuery } from "./static"

// Types
import type MySQLConnection from "../Connection"
import type { Constructor } from "../../types/General"
import type { DatabaseSchemaAction } from "./types"

export default class DatabaseSchema<T extends TableSchema> extends Array<T> {
    public static databaseSchemaQuery = databaseSchemaQuery

    protected previous?: DatabaseSchema<T>
    protected triggers?: TriggersSchema
    protected actions: DatabaseSchemaAction[] = []

    constructor(
        public connection: MySQLConnection,
        ...tables: (T | TableSchemaInitMap)[]
    ) {
        super(...tables.map(table => table instanceof TableSchema
            ? table
            : new TableSchema(
                table.tableName,
                ...table.columns
            ) as T
        ))

        this.orderByDependencies()
    }

    static get [Symbol.species]() {
        return Array
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get TableConstructor(): typeof TableSchema {
        return TableSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createTable(name: string): T {
        const table = new TableSchema(name) as T

        this.push(table)
        this.actions.push(['CREATE', table])

        return table
    }

    // ------------------------------------------------------------------------

    public alterTable(name: string): T {
        const table = this.findOrThrow(name)
        this.actions.push(['ALTER', table])

        return table
    }

    // ------------------------------------------------------------------------

    public dropTable(name: string): void {
        const table = this.findOrThrow(name)

        this.actions.push(['DROP', table])
        this.splice(this.indexOf(table), 1)
    }

    // ------------------------------------------------------------------------

    public findTable(name: string): TableSchema | undefined {
        return this.find(t => t.name === name)
    }

    // Privates ---------------------------------------------------------------
    private findOrThrow(name: string): T {
        const table = this.findTable(name)
        if (!table) throw new Error

        return table as T
    }

    // ------------------------------------------------------------------------

    private orderByDependencies(): this {
        return this.sort((a, b) => a.dependencies.includes(b.name) ? -1 : 1)
    }

    // ------------------------------------------------------------------------

    protected async previuosSchema(): Promise<DatabaseSchema<T>> {
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

    protected triggersSchema(): TriggersSchema {
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

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromConnectionMetadata<
        T extends Constructor<DatabaseSchema<any>>
    >(
        this: T,
        connection: MySQLConnection
    ): InstanceType<T> {
        const included = new Set<string>()

        return new this(
            connection,
            ...connection.entities.flatMap(target => {
                const meta = EntityMetadata.find(target)
                if (!meta) throw new Error

                return [
                    (this as T & typeof DatabaseSchema)
                        .TableConstructor
                        .buildFromMetadata(meta),

                    ...(this as T & typeof DatabaseSchema)
                        .TableConstructor
                        .buildJoinTablesFromMetadata(meta)
                ]
            })
                .filter(({ name }) => {
                    if (included.has(name)) return false

                    included.add(name)
                    return true
                }),
        ) as InstanceType<T>
    }
}

export {
    TableSchema,
    ColumnSchema,
    TriggersSchema,
    TriggerSchema,

    type ColumnSchemaInitMap,
    type ColumnPropertiesMap,
    type ForeignKeyReferencesSchema
}