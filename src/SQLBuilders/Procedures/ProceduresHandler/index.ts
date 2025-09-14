import UpdateOrCreate from "../UpdateOrCreate"
import SyncManyToMany from "../SyncManyToMany"
import {
    InsertMigration,
    DeleteMigration,
    MigrateRollProcedure,
    MigrateRollbackProcedure
} from "../MigrationProcedures"

// Types
import type MySQLConnection from "../../../Connection"

export default class ProceduresHandler {
    private constructor() {
        throw new Error
    }

    public static readonly procedures = [
        UpdateOrCreate,
        SyncManyToMany,

        InsertMigration,
        DeleteMigration,
        MigrateRollProcedure,
        MigrateRollbackProcedure
    ]

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static async register(connection: MySQLConnection): Promise<void> {
        for (const procedure of this.procedures) (
            await new procedure().register(connection)
        )
    }
}