// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { PolyORMConnection } from "../../Metadata"

export default abstract class Procedure {
    protected connection!: PolyORMConnection

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.constructor.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CREATE PROCEDURE ${this.name} (${this.argsSQL()})
            BEGIN ${this.proccessSQL()} END;
        `)
    }

    // ------------------------------------------------------------------------

    public async register(connection: PolyORMConnection): Promise<void> {
        this.connection = connection

        await this.connection.query(this.dropIfExistsSQL())
        await this.connection.query(this.SQL())
    }

    // ------------------------------------------------------------------------

    public abstract argsSQL(): string

    // ------------------------------------------------------------------------

    public abstract proccessSQL(): string

    // Privates ---------------------------------------------------------------
    private dropIfExistsSQL(): string {
        return `DROP PROCEDURE IF EXISTS ${this.name}`
    }
}