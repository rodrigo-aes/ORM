import { TriggerSchema } from "../../../../DatabaseSchema"

// Types
import type MySQLConnection from "../../../../Connection"
import type { ActionType } from "../../../../DatabaseSchema"

export default class TriggerMigrator extends TriggerSchema {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: MySQLConnection): Promise<void> {
        await connection.query(this.dropSQL())
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: MySQLConnection): Promise<void> {
        await connection.query(this.alterSQL())
    }

    // ------------------------------------------------------------------------

    public async drop(connection: MySQLConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public executeAction(action: ActionType, connection: MySQLConnection): (
        Promise<void>
    ) {
        switch (action) {
            case "CREATE": return this.create(connection)
            case "ALTER": return this.alter(connection)
            case "DROP": return this.drop(connection)

            default: throw new Error
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(schema: TriggerSchema): TriggerMigrator {
        return new TriggerMigrator({
            tableName: schema.tableName,
            name: schema.name,
            event: schema.event,
            timing: schema.timing,
            orientation: schema.orientation,
            action: schema.actionBodySQL()
        })
    }
}