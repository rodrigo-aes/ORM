import Procedure from "../../Procedure"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../../Helpers"

// Types
import type MySQLConnection from "../../../../Connection"
import type { InsertMigrationArgs } from "./types"

export default class InsertMigration extends Procedure {
    public argsSQL(): string {
        return `
            IN new_name VARCHAR(255),
            IN new_order INT
        `
    }

    public proccessSQL(): string {
        return `
            DECLARE last_order INT;

            IF new_order IS NOT NULL THEN
                UPDATE __migrations
                SET \`order\` = \`order\` + 1
                WHERE \`order\` >= new_order;

                INSERT INTO __migrations (
                    \`name\`, \`order\`, \`createdAt\`, \`updatedAt\`
                )
                VALUES (new_name, new_order, NOW(), NOW());

            ELSE
                SELECT COALESCE(MAX(\`order\`), 0) + 1
                INTO last_order
                FROM __migrations;

                INSERT INTO __migrations (
                    \`name\`, \`order\`, \`createdAt\`, \`updatedAt\`
                )
                VALUES (new_name, last_order, NOW(), NOW());
            END IF;

            SELECT * FROM __migrations
            WHERE id = LAST_INSERT_ID()
            LIMIT 1;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: MySQLConnection,
        ...args: InsertMigrationArgs
    ): Promise<any[]> {
        return connection.query(this.SQL(...args))
    }

    // ------------------------------------------------------------------------

    public static SQL(...args: InsertMigrationArgs): string {
        return SQLStringHelper.normalizeSQL(`
            CALL ${this.name} (
                ${args.map(arg => arg ? PropertySQLHelper.valueSQL(arg) : 'NULL')}
            )
        `)
    }
}