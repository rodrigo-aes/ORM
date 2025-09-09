import { TableSQLBuilder } from "../../../SQLBuilders"
import ColumnSyncronizer from "./ColumnSyncronizer"

// Types
import type MySQLConnection from "../../../Connection"
import type { TableSchema } from "../../../DatabaseSchema"

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
}