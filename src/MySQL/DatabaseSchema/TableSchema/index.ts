import { EntityMetadata, DataType } from "../../Metadata"

import ColumnSchema, { type ColumnSchemaInitMap } from "./ColumnSchema"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type MySQLConnection from "../../Connection"
import type { EntityTarget } from "../../../types/General"
import type { TableSchemaAction } from "./types"

export default class TableSchema extends Array<ColumnSchema> {
    public dependencies: string[]

    constructor(
        public name: string,
        ...columns: (ColumnSchema | Omit<ColumnSchemaInitMap, 'tableName'>)[]
    ) {
        super(...columns.map(col => col instanceof ColumnSchema
            ? col
            : new ColumnSchema({
                ...col,
                tableName: name
            })
        ))

        this.dependencies = this.flatMap(({ dependence }) => dependence ?? [])
    }

    static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public column(name: string, dataType: DataType): ColumnSchema {
        const column = new ColumnSchema({
            tableName: this.name,
            name,
            dataType
        })

        this.push(column)
        return column
    }

    // ------------------------------------------------------------------------

    // public addTrigger(trigger: typeof Trigger): this {
    //     this.triggers.push(trigger)
    //     return this
    // }

    // // ------------------------------------------------------------------------

    // public dropTrigger(trigger: typeof Trigger | string): this {
    //     this.triggers.splice(
    //         this.triggers.findIndex(t => typeof trigger === 'object'
    //             ? t.name === (trigger as typeof Trigger).name
    //             : t.name === (
    //                 (trigger as string).charAt(0).toUpperCase() +
    //                 (trigger as string).slice(1)
    //             )
    //         ),
    //         1
    //     )

    //     return this
    // }

    // ------------------------------------------------------------------------

    public async create(connection: MySQLConnection): Promise<void> {
        console.log(this.createSQL())
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: MySQLConnection, schema: TableSchema): (
        Promise<void>
    ) {
        await connection.query(this.alterSQL(schema))
    }

    // ------------------------------------------------------------------------

    public async drop(connection: MySQLConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public async executeAction(
        connection: MySQLConnection,
        schema?: TableSchema
    ): Promise<void> {
        const sql = this.actionSQL(schema)
        if (sql) await connection.query(sql)
    }

    // ------------------------------------------------------------------------

    public createSQL() {
        return SQLStringHelper.normalizeSQL(`
            CREATE TABLE ${this.name} (${this.createColumnsSQL()})
        `)
    }

    // ------------------------------------------------------------------------

    public alterSQL(schema: TableSchema) {
        return SQLStringHelper.normalizeSQL(`  
            ALTER TABLE ${this.name} ${this.alterColumnsSQL(schema)}
        `)
    }

    // ------------------------------------------------------------------------

    public dropSQL() {
        return `DROP TABLE ${this.name}`
    }

    // ------------------------------------------------------------------------

    public actionSQL(schema?: TableSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'ADD': return this.createSQL()
            case 'ALTER': return this.alterSQL(schema!)
        }
    }

    // ------------------------------------------------------------------------

    public compare(schema?: TableSchema): Omit<TableSchemaAction, 'DROP'> {
        switch (true) {
            case !schema: return 'ADD'
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // ------------------------------------------------------------------------

    public findColumn(columnName: string) {
        return this.find(col => col.name === columnName)
    }

    // Privates ---------------------------------------------------------------
    private createColumnsSQL(): string {
        return this.map(column => column.createSQL()).join(', ')
    }

    // ------------------------------------------------------------------------

    private alterColumnsSQL(schema: TableSchema): string {
        return this.map(column => column.actionSQL(
            schema.findColumn(column.name)
        ))
            .filter(action => !!action)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private shouldAlter(schema: TableSchema): boolean {
        return this.some(column => {
            const [action, fkAction] = column.compare(
                schema.findColumn(column.name)
            )

            return action !== 'NONE' || fkAction !== 'NONE'
        })
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadata(source: EntityMetadata | EntityTarget): (
        TableSchema
    ) {
        const { tableName, columns } = this.metadataFromSource(source)

        return new TableSchema(
            tableName,
            ...columns.map(
                column => ColumnSchema.buildFromMetadata(column)
            )
        )
    }

    // ------------------------------------------------------------------------

    public static buildJoinTablesFromMetadata(
        source: EntityMetadata | EntityTarget
    ): TableSchema[] {
        return this.metadataFromSource(source).joinTables?.map(
            ({ tableName, columns }) => new TableSchema(
                tableName,
                ...columns.map(
                    column => ColumnSchema.buildFromMetadata(column)
                )
            )
        )
            ?? []
    }

    // Privates ---------------------------------------------------------------
    private static metadataFromSource(source: EntityMetadata | EntityTarget) {
        const metadata = source instanceof EntityMetadata
            ? source
            : EntityMetadata.find(source)

        if (!metadata) throw new Error

        return metadata
    }
}

export {
    ColumnSchema,

    type ColumnSchemaInitMap,
}