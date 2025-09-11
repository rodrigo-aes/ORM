import Procedure from "../../Procedure"

// Types
import type MySQLConnection from "../../../../Connection"

export default class MigrateRollbackProcedure extends Procedure {
    public argsSQL(): string {
        return 'IN at INT'
    }

    public proccessSQL(): string {
        return `
            CREATE TEMPORARY TABLE to_rollback AS 
                SELECT \`name\`, \`order\`, \`fileName\` FROM __migrations
                WHERE 
                    migrated = TRUE 
                    AND migratedTime = COALESCE(
                        (SELECT MAX(migratedTime) FROM __migrations), 1
                    )
                    AND (at IS NULL OR \`order\` = at);

            UPDATE __migrations SET
                migrated = FALSE,
                migratedTime = NULL,
                migratedAt = NULL
            WHERE 
                migrated = TRUE 
                AND migratedTime = COALESCE(
                    (SELECT MAX(migratedTime) FROM __migrations), 1
                );

            SELECT * FROM to_rollback ORDER BY \`order\` DESC;

            DROP TEMPORARY TABLE to_rollback;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: MySQLConnection,
        at?: number
    ): Promise<any[]> {
        return connection.query(this.SQL(at))
    }

    // ------------------------------------------------------------------------

    public static SQL(at?: number): string {
        return `CALL ${this.name}("${at}")`
    }
}