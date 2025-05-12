import TableSchema, {
    ColumnSchema,
    ColumnSchemaInitMap,
    TableColumnAction,
} from "./TableSchema"

// Statics 
import { databaseSchemaQuery } from "./static"

// Types
import type MySQLConnection from "../../Connection"
import type { SyncronizerTable } from "../types"
import type {
    DatabaseSchemaMap,
    AlterTable,
    SyncTableData
} from "./types"

export default class DatabaseSchema {
    public dbSchema!: DatabaseSchemaMap
    public tables!: TableSchema[]

    constructor(
        private connection: MySQLConnection
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async loadDatabaseSchema(): Promise<this> {
        this.dbSchema = await this.connection.query(databaseSchemaQuery)
        this.tables = this.dbSchema.map(
            ({ tableName, columns }) => new TableSchema(tableName, ...columns)
        )

        return this
    }

    // ------------------------------------------------------------------------

    public findTableSchema(tableName: string): TableSchema | undefined {
        return this.tables.find(({ name }) => tableName === name)
    }

    // ------------------------------------------------------------------------

    public toSyncTablesActions(tables: SyncronizerTable[]): AlterTable[] {
        return this.syncTablesActions(tables).filter(
            ([action]) => action !== 'NONE'
        )
    }

    // ------------------------------------------------------------------------

    public syncTablesActions(tables: SyncronizerTable[]): AlterTable[] {
        return [
            ...this.tableSchemasToDrop(tables),
            ...tables.map(table => this.syncTableAction(table))
        ]
    }

    // ------------------------------------------------------------------------

    public tableSchemasToDrop(tables: SyncronizerTable[]): AlterTable[] {
        return this.tables.filter(
            ({ name }) => !tables.some(({ tableName }) => name === tableName)
        )
            .map(schema => ['DROP', schema as SyncTableData, undefined])
    }

    // ------------------------------------------------------------------------

    public syncTableAction(table: SyncronizerTable): AlterTable {
        const schema = this.findTableSchema(table.tableName)
        if (!schema) return ['CREATE', table, undefined]

        const columnsActions = schema.compare(table)
        if (columnsActions.some(([action]) => action !== 'NONE')) {
            return ['ALTER', table, columnsActions]
        }

        return ['NONE', table, undefined]
    }
}

export {
    TableSchema,
    ColumnSchema,

    type AlterTable,
    type ColumnSchemaInitMap,
    type TableColumnAction,
}