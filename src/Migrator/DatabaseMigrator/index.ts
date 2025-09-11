import DatabaseSchema, { type TableSchema } from "../../DatabaseSchema"
import TableMigrator, { ColumnMigrator } from "./TableMigrator"

// Types
import type MySQLConnection from "../../Connection"
import type { ActionType } from "../../DatabaseSchema"

export default class DatabaseMigrator extends DatabaseSchema<TableMigrator> {
    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get TableConstructor(): typeof TableSchema {
        return TableMigrator as typeof TableSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async migrate(): Promise<void> {
        for (const [action, { name }] of this.actions) (
            await this.execTableAction(name, action)
        )
    }

    // Privates ---------------------------------------------------------------
    private execTableAction(name: string, action: ActionType): (
        Promise<void> | void
    ) {
        const table = this.findOrThrow(name)

        switch (action) {
            case "CREATE": return table.create(this.connection)
            case "ALTER": return table.alter(this.connection, action)
            case "DROP": return table.drop(this.connection)
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(
        schema: DatabaseSchema,
        connection?: MySQLConnection
    ): DatabaseMigrator {
        const migrator = new DatabaseMigrator(connection ?? schema.connection)

        migrator.push(...schema.map(
            schema => TableMigrator.buildFromSchema(migrator, schema)
        ))

        migrator.actions = schema.actions

        return migrator
    }
}

export {
    TableMigrator,
    ColumnMigrator
}