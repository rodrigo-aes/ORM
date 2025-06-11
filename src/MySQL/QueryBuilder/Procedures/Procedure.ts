// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type MySQLConnection from "../../Connection"

export default abstract class Procedure {
    protected connection!: MySQLConnection

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

    public async register(connection: MySQLConnection): Promise<void> {
        this.connection = connection

        await this.connection.query(this.dropIdExistsSQL())
        await this.connection.query(this.SQL())
    }

    // ------------------------------------------------------------------------

    public abstract argsSQL(): string

    // ------------------------------------------------------------------------

    public abstract proccessSQL(): string

    // Privates ---------------------------------------------------------------
    private dropIdExistsSQL(): string {
        return `DROP PROCEDURE IF EXISTS ${this.name}`
    }
}