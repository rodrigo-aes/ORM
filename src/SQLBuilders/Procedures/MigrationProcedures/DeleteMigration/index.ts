import Procedure from "../../Procedure"

// Helpers
import { SQLStringHelper } from "../../../../Helpers"

// Types
import type { PolyORMConnection } from "../../../../Metadata"
import type { DeleteMigrationArgs } from "./types"

export default class DeleteMigration extends Procedure {
    public argsSQL(): string {
        return `
            IN unique_identifier VARCHAR(255),
            OUT deleted_order INT
        `
    }

    public proccessSQL(): string {
        return `
            SELECT \`order\` INTO deleted_order FROM __migrations
                WHERE \`name\` = unique_identifier
                OR \`fileName\` = unique_identifier
                OR (
                    unique_identifier REGEXP '^[0-9]+$' AND 
                    \`order\` = CAST(unique_identifier AS UNSIGNED)
                );   

            DELETE FROM __migrations
                WHERE \`name\` = unique_identifier
                OR \`fileName\` = unique_identifier
                OR (
                    unique_identifier REGEXP '^[0-9]+$' AND 
                    \`order\` = CAST(unique_identifier AS UNSIGNED)
                );

            UPDATE __migrations 
                SET \`order\` = \`order\` - 1
                WHERE \`order\` > deleted_order;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: PolyORMConnection,
        ...args: DeleteMigrationArgs
    ): Promise<any[]> {
        return connection.query(this.SQL(...args))
    }

    // ------------------------------------------------------------------------

    public static SQL(...args: DeleteMigrationArgs): string {
        return SQLStringHelper.normalizeSQL(`
            CALL ${this.name} (${args.map(arg => `"${arg}"`)}, @deleted);
            SELECT @deleted    
        `)
    }
}