import Procedure from "../../Procedure"

// Helpers
import { PropertySQLHelper } from "../../../../Helpers"

// Types
import type MySQLConnection from "../../../../Connection"

export default class MoveMigration extends Procedure {
    public argsSQL(): string {
        return `
            IN from_order INT,
            IN to_order INT
        `
    }

    public proccessSQL(): string {
        return `
            UPDATE __migrations SET \`order\` = 0 WHERE \`order\` = from_order;

            IF from_order > to_order THEN
                UPDATE __migrations 
                    SET \`order\` = \`order\` + 1
                WHERE \`order\` >= to_order AND \`order\` < from_order
                ORDER BY \`order\` DESC;
            ELSE
                UPDATE __migrations 
                    SET \`order\` = \`order\` - 1
                WHERE \`order\` <= to_order AND \`order\` > from_order;
            END IF;

            UPDATE __migrations SET \`order\` = to_order WHERE \`order\` = 0;
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static call(
        connection: MySQLConnection,
        from: number,
        to: number
    ): Promise<any[]> {
        return connection.query(this.SQL(from, to))
    }

    // ------------------------------------------------------------------------

    public static SQL(from: number, to: number): string {
        return `CALL ${this.name} (${from}, ${to})`
    }
}