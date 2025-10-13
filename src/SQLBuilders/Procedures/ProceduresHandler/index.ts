import type Procedure from "../Procedure"
import UpdateOrCreate from "../UpdateOrCreate"
import SyncManyToMany from "../SyncManyToMany"
import {
    InsertMigration,
    DeleteMigration,
    MoveMigration
} from "../MigrationProcedures"

// Types
import type { PolyORMConnection } from "../../../Metadata"

// Exceptions
import PolyORMException from "../../../Errors"

export default class ProceduresHandler {
    private constructor() {
        PolyORMException.Common.throw(
            'NOT_INSTANTIABLE_CLASS', 'ProceduresHandler'
        )
    }

    public static readonly procedures: Procedure[] = [
        UpdateOrCreate,
        SyncManyToMany,

        InsertMigration,
        DeleteMigration,
        MoveMigration
    ]

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static async register(connection: string | PolyORMConnection): (
        Promise<void>
    ) {
        for (const procedure of this.procedures) (
            await procedure.connection(connection).register()
        )
    }
}