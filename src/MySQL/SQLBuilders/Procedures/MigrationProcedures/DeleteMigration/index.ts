import Procedure from "../../Procedure"

// Types
import type MySQLConnection from "../../../../Connection"
import type { DeleteMigrationArgs } from "./types"

export default class DeleteMigration extends Procedure {
    public argsSQL(): string {
        return `
            IN unique_identifier VARCHAR(255)
        `
    }

    public proccessSQL(): string {
        return `
            DECLARE deleted_order INT;

            SELECT \`order\` INTO deleted_order FROM __migrations
                WHERE \`name\` = unique_identifier
                OR \`fileName\` = unique_identifier;    

            DELETE FROM __migrations
                WHERE \`name\` = unique_identifier
                OR \`fileName\` = unique_identifier;

            UPDATE __migrations 
                SET \`order\` = \`order\` - 1
                WHERE \`order\` > deleted_order;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: MySQLConnection,
        ...args: DeleteMigrationArgs
    ): Promise<any[]> {
        return connection.query(this.SQL(...args))
    }

    // ------------------------------------------------------------------------

    public static SQL(...args: DeleteMigrationArgs): string {
        return `CALL ${this.name} (${args.map(arg => `"${arg}"`)})`
    }
}