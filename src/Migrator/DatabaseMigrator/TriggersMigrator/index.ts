import { TriggersSchema } from "../../../DatabaseSchema"

// Migrators
import TriggerMigrator from "./TriggerMigrator"

// Types
import type MySQLConnection from "../../../Connection"

export default class TriggersMigrator extends TriggersSchema<TriggerMigrator> {
    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get TriggerConstructor(): (
        typeof TriggerMigrator
    ) {
        return TriggerMigrator
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async executeActions(): Promise<void> {
        for (const [action, schema] of this.actions) (
            await TriggerMigrator.buildFromSchema(schema).executeAction(
                action,
                this.connection
            )
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(
        schema: TriggersSchema,
        connection?: MySQLConnection
    ): TriggersMigrator {
        const migrator = new TriggersMigrator(connection ?? schema.connection)
        migrator.actions = schema.actions

        return migrator
    }
}