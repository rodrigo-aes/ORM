import Procedure from "../../Procedure"

// Types
import type MySQLConnection from "../../../../Connection"

export default class MigrateRollProcedure extends Procedure {
    public argsSQL(): string {
        return ''
    }

    public proccessSQL(): string {
        return `
            CREATE TEMPORARY TABLE to_migrate AS 
                SELECT \`name\`, \`order\`, \`fileName\` FROM __migrations
                WHERE migrated = FALSE;
                
            UPDATE __migrations SET
                migrated = TRUE,
                migratedTime = COALESCE(
                    (SELECT MAX(migratedTime) FROM __migrations), 0
                ) + 1,
                migratedAt = NOW()
            WHERE migrated = FALSE;

            SELECT * FROM to_migrate ORDER BY \`order\` ASC;

            DROP TEMPORARY TABLE to_migrate;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: MySQLConnection
    ): Promise<any[]> {
        return connection.query(this.SQL())
    }

    // ------------------------------------------------------------------------

    public static SQL(): string {
        return `CALL ${this.name}()`
    }
}