import { TableSQLBuilder } from "../../../SQLBuilders"
import ColumnSyncronizer from "./ColumnSyncronizer"

// Types
import type MySQLConnection from "../../../Connection"
import type { TableSchema } from "../../../DatabaseSchema"
import type { TableSyncAction } from "./types"


export default class TableSyncronizer extends TableSQLBuilder<
    ColumnSyncronizer
> {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    protected static override get ColumnConstructor(): (
        typeof ColumnSyncronizer
    ) {
        return ColumnSyncronizer
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: MySQLConnection): Promise<void> {
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: MySQLConnection, schema: TableSchema): (
        Promise<void>
    ) {
        await connection.query(this.syncAlterSQL(schema))
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
        const sql = this.syncActionSQL(schema)
        if (sql) await connection.query(sql)
    }

    // ------------------------------------------------------------------------

    public syncActionSQL(schema?: TableSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'ADD': return this.createSQL()
            case 'ALTER': return this.syncAlterSQL(schema!)
        }
    }

    // ------------------------------------------------------------------------

    public compare(schema?: TableSchema): Omit<TableSyncAction, 'DROP'> {
        switch (true) {
            case !schema: return 'ADD'
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // Privates ---------------------------------------------------------------
    private shouldAlter(schema: TableSchema): boolean {
        return this.some(column => {
            const [action, fkAction] = column.compare(
                schema.findColumn(column.name)
            )

            return action !== 'NONE' || fkAction !== 'NONE'
        })
    }
}