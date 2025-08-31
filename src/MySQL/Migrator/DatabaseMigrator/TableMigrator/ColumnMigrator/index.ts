import { ColumnSQLBuilder } from "../../../../SQLBuilders"

// Types
import type { ColumnSchema } from "../../../../DatabaseSchema"

export default class ColumnMigrator extends ColumnSQLBuilder {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(schema: ColumnSchema): ColumnMigrator {
        const { tableName, name, dataType, map, actions } = schema

        const migrator = new ColumnMigrator({
            tableName,
            name,
            dataType,
            ...map
        })

        migrator.actions = actions

        return migrator
    }
}