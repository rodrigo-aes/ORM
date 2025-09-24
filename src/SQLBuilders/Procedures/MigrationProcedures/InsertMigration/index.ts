import Procedure from "../../Procedure"

// Helpers
import { SQLStringHelper } from "../../../../Helpers"

// Types
import type { PolyORMConnection } from "../../../../Metadata"
import type { InsertMigrationArgs } from "./types"

export default class InsertMigration extends Procedure {
    public argsSQL(): string {
        return `
            IN new_name VARCHAR(255),
            IN new_order INT,
            IN new_created_at DATE
        `
    }

    public proccessSQL(): string {
        return `
            DECLARE last_order INT;

            IF new_order IS NOT NULL THEN
                UPDATE __migrations
                SET 
                    \`order\` = \`order\` + 1,
                    \`updatedAt\` = NOW()
                WHERE \`order\` >= new_order
                ORDER BY \`order\` DESC;

                INSERT INTO __migrations (
                    \`name\`, \`order\`, \`createdAt\`, \`updatedAt\`
                )
                VALUES (
                    new_name,
                    new_order,
                    IFNULL(new_created_at, NOW()),
                    NOW()
                );

            ELSE
                SELECT COALESCE(MAX(\`order\`), 0) + 1
                INTO last_order
                FROM __migrations;

                INSERT INTO __migrations (
                    \`name\`, \`order\`, \`createdAt\`, \`updatedAt\`
                )
                VALUES (
                    new_name,
                    last_order,
                    IFNULL(new_created_at, NOW()),
                    NOW()
                );
            END IF;

            IF new_order IS NOT NULL THEN
                SELECT \`name\`, \`order\`, \`fileName\`, \`name\` 
                FROM __migrations
                WHERE \`order\` >= new_order
                ORDER BY
                    CASE WHEN id = LAST_INSERT_ID() THEN 0 ELSE 1 END,
                    \`order\`;
            ELSE
                SELECT \`name\`, \`order\`, \`fileName\`, \`name\` 
                FROM __migrations
                WHERE id = LAST_INSERT_ID();
            END IF;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: PolyORMConnection,
        name: string,
        position?: number,
        createdAt?: string
    ): Promise<any[]> {
        return connection.query(this.SQL(name, position, createdAt))
    }

    // ------------------------------------------------------------------------

    public static SQL(
        name: string,
        position?: number,
        createdAt?: string
    ): string {
        return SQLStringHelper.normalizeSQL(`CALL ${this.name} (
            "${name}",
            ${position ?? 'NULL'},
            ${createdAt ? `"${createdAt}"` : 'NULL'}
        )`)
    }
}