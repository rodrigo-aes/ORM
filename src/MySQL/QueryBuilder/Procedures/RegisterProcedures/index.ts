import UpdateOrCreate from "../UpdateOrCreate"

// Types
import type MySQLConnection from "../../../Connection"

export default class RegisterProcedures {
    private constructor() {
        throw new Error
    }

    public static readonly procedures = [
        UpdateOrCreate
    ]

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static async register(connection: MySQLConnection): Promise<void> {
        for (const procedure of this.procedures) (
            await new procedure().register(connection)
        )
    }
}