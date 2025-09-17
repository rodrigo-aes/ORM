import { EntityMetadata } from "../Metadata"

import TableSchema, {
    ColumnSchema,
    ForeignKeyReferencesSchema,

    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ForeignKeyReferencesSchemaMap
} from "./TableSchema"

import TriggersSchema, { TriggerSchema } from "./TriggersSchema"

// Statics 
import { databaseSchemaQuery } from "./static"

// Types
import type MySQLConnection from "../Connection"
import type { Constructor } from "../types/General"
import type {
    DatabaseSchemaAction,
    ActionType,
    TableSchemaHandler
} from "./types"

export default class DatabaseSchema<
    T extends TableSchema = TableSchema
> extends Array<T> {
    /** @internal */
    public static databaseSchemaQuery = databaseSchemaQuery

    /** @internal */
    public actions: DatabaseSchemaAction[] = []

    /** @internal */
    protected previous?: DatabaseSchema<T>

    /** @internal */
    protected triggers!: TriggersSchema

    /** @internal */
    constructor(
        /** @internal */
        public connection: MySQLConnection,

        ...tables: (T | TableSchemaInitMap)[]
    ) {
        super()
        this.push(...tables.map(table => table instanceof TableSchema
            ? table
            : new TableSchema(
                this,
                table.tableName,
                ...table.columns
            ) as T
        ))

        this.orderByDependencies()
    }

    /** @internal */
    static get [Symbol.species]() {
        return Array
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static get TableConstructor(): typeof TableSchema {
        return TableSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a database table
     * @param name - Table name 
     * @param handle - Handle table columns and attributes
     */
    public createTable(name: string, handle: TableSchemaHandler): void {
        const table = new TableSchema(this, name) as T

        this.push(table)
        this.actions.push(['CREATE', table])

        return handle(table)
    }

    // ------------------------------------------------------------------------

    /**
     * Alter a database table
     * @param name - Table name 
     * @param handle - Handle table columns and attributes changes
     */
    public alterTable(name: string, handle: TableSchemaHandler): void {
        const table = this.findOrThrow(name)
        this.actions.push(['ALTER', table])

        return handle(table)
    }

    // ------------------------------------------------------------------------

    /**
     * Drop a database table
     * @param name - Table name
     */
    public dropTable(name: string): void {
        const table = this.findOrThrow(name)
        this.actions.push(['DROP', table])
    }

    // ------------------------------------------------------------------------

    /**
     * Create a trigger from a database table
     * @param tableName - Table name
     * @param name - Trigger name
     * @returns - A trigger schema to handle
     */
    public createTrigger(tableName: string, name: string): TriggerSchema {
        return this.triggersSchema().create(tableName, name)
    }

    // ------------------------------------------------------------------------

    /**
     * Find a table schema by name
     * @param name - Table name
     */
    public findTable(name: string): T | undefined {
        return this.find(t => t.name === name)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public findOrThrow(name: string): T {
        const table = this.findTable(name)
        if (!table) throw new Error

        return table
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private orderByDependencies(): this {
        return this.sort((a, b) => a.dependencies.includes(b.name) ? -1 : 1)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected async previuosSchema(): Promise<DatabaseSchema<T>> {
        if (this.previous) return this.previous

        this.previous = new DatabaseSchema(
            this.connection,
            ...await this.connection.query(
                databaseSchemaQuery(),
                undefined,
            )
        )

        return this.previous
    }

    // ------------------------------------------------------------------------

    /** @internal */
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
    /** @internal */
    public static buildFromConnectionMetadata<
        T extends Constructor<DatabaseSchema<any>>
    >(
        this: T,
        connection: MySQLConnection
    ): InstanceType<T> {
        const included = new Set<string>()
        const database = new this(connection)

        database.push(...connection.entities.flatMap(target => {
            const meta = EntityMetadata.find(target)
            if (!meta) throw new Error

            return [
                (this as T & typeof DatabaseSchema)
                    .TableConstructor
                    .buildFromMetadata(database, meta),

                ...(this as T & typeof DatabaseSchema)
                    .TableConstructor
                    .buildJoinTablesFromMetadata(database, meta)
            ]
        })
            .filter(({ name }) => {
                if (included.has(name)) return false

                included.add(name)
                return true
            }))

        return database as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public static async buildFromDatabase<
        T extends Constructor<DatabaseSchema<any>>
    >(
        this: T,
        connection: MySQLConnection
    ): Promise<InstanceType<T>> {
        return new this(connection, ...await connection.query(
            databaseSchemaQuery(),
            undefined,
        )
        ) as InstanceType<T>
    }
}

export {
    TableSchema,
    ColumnSchema,
    ForeignKeyReferencesSchema,
    TriggersSchema,
    TriggerSchema,

    type ActionType,
    type TableSchemaInitMap,
    type ColumnSchemaInitMap,
    type ColumnSchemaMap,
    type ForeignKeyReferencesSchemaMap
}