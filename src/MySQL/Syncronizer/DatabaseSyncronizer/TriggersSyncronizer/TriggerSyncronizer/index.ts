import { TriggerSQLBuilder } from "../../../../SQLBuilders"

// Types
import type MySQLConnection from "../../../../Connection"
import type { TriggerSchema } from "../../../../DatabaseSchema"
import type { TriggerSyncAction } from "./types"

export default class TriggerSyncronizer extends TriggerSQLBuilder {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: MySQLConnection): Promise<void> {
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: MySQLConnection): Promise<void> {
        await connection.query(this.alterSQL())
    }

    // ------------------------------------------------------------------------

    public async drop(connection: MySQLConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public async executeAction(
        connection: MySQLConnection,
        schema?: TriggerSchema
    ): Promise<void> {
        const sql = this.actionSQL(schema)
        if (sql) await connection.query(sql)
    }

    // ------------------------------------------------------------------------

    public actionSQL(schema?: TriggerSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'ADD': return this.createSQL()
            case 'ALTER': return this.alterSQL()
        }
    }

    // ------------------------------------------------------------------------

    public compare(schema?: TriggerSchema): Omit<TriggerSyncAction, 'DROP'> {
        switch (true) {
            case !schema: return 'ADD'
            case this.shouldAlter(schema!): return 'ALTER'

            default: return 'NONE'
        }
    }

    // Privates ---------------------------------------------------------------
    private shouldAlter(schema: TriggerSchema): boolean {
        return (['event', 'action', 'timing', 'name'] as (
            (keyof TriggerSchema)[]
        ))
            .some(key => this[key] !== schema[key])
    }
}