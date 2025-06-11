import Procedure from "../Procedure"

// Helpers
import { PropertySQLHelper } from "../../../Helpers"

// Types
import type MySQLConnection from "../../../Connection"
import type { UpdateOrCreateArgs } from "./types"

export default class UpdateOrCreate extends Procedure {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public argsSQL(): string {
        return `
            IN insertSQL TEXT,
            IN selectSQL TEXT
        `
    }

    // ------------------------------------------------------------------------

    public proccessSQL(): string {
        return `
            SET @query = insertSQL;
            PREPARE stmt FROM @query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;

            SET @query = selectSQL;
            PREPARE stmt FROM @query;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: MySQLConnection,
        ...args: UpdateOrCreateArgs
    ): Promise<any[]> {
        return connection.query(this.SQL(...args))
    }

    // ------------------------------------------------------------------------

    public static SQL(...args: UpdateOrCreateArgs): string {
        return `CALL ${this.name} (${args.map(arg => `"${arg}"`)})`
    }
}

export {
    type UpdateOrCreateArgs
}