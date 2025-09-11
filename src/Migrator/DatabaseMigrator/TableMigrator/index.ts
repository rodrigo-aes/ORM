import { TableSQLBuilder } from "../../../SQLBuilders"

// Migrators
import ColumnMigrator from "./ColumnMigrator"

// Types
import type MySQLConnection from "../../../Connection"
import type DatabaseSchema from "../../../DatabaseSchema"
import type { TableSchema, ActionType } from "../../../DatabaseSchema"
export default class TableMigrator extends TableSQLBuilder<ColumnMigrator> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected static override get ColumnConstructor(): typeof ColumnMigrator {
        return ColumnMigrator
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: MySQLConnection): Promise<void> {
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(
        connection: MySQLConnection,
        action: Omit<ActionType, 'CREATE'>
    ): Promise<void> {
        await connection.query(this.migrateAlterSQL(action))
    }

    // ------------------------------------------------------------------------

    public async drop(connection: MySQLConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public action(connection: MySQLConnection, action: ActionType): (
        Promise<void> | void
    ) {
        switch (action) {
            case "CREATE": return this.create(connection)
            case "ALTER": return this.alter(connection, action)
            case "DROP": return this.drop(connection)
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(
        database: DatabaseSchema,
        schema: TableSchema
    ): TableMigrator {
        const migrator = new TableMigrator(
            database,
            schema.name,
            ...schema.map(schema => ColumnMigrator.buildFromSchema(schema))
        )

        migrator.actions = schema.actions

        return migrator
    }
}

export {
    ColumnMigrator
}