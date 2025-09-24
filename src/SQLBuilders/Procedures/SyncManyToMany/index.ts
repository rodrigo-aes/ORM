import Procedure from "../Procedure"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { PolyORMConnection } from "../../../Metadata"
import type { SyncManyToManyArgs } from "./types"

export default class SyncManyToMany extends Procedure {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public argsSQL(): string {
        return `
            IN insertSQL TEXT,
            IN deleteSQL TEXT
        `
    }

    // ------------------------------------------------------------------------

    public proccessSQL(): string {
        return `
            SET @query = insertSQL;
            PREPARE stmt FROM @query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;

            IF deleteSQL IS NOT NULL AND deleteSQL != '' THEN
                SET @query = deleteSQL;
                PREPARE stmt FROM @query;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
            END IF;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static async call(
        connection: PolyORMConnection,
        insertSQL: string,
        deleteSQL?: string
    ): Promise<void> {
        await connection.query(this.SQL(insertSQL, deleteSQL))
    }

    // ------------------------------------------------------------------------

    public static SQL(insertSQL: string, deleteSQL?: string): string {
        return SQLStringHelper.normalizeSQL(`
            CALL ${this.name} (
                "${insertSQL}",
                ${deleteSQL ? `"${deleteSQL}"` : 'NULL'}
            )
        `)
    }
}

export {
    type SyncManyToManyArgs
}