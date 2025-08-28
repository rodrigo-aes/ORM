// Helpers
import { SQLStringHelper } from "../../../../Helpers"

// Types
import type MySQLConnection from "../../../../Connection"
import type {
    Trigger,
    TriggerTiming,
    TriggerEvent,
    TriggerOrientation
} from "../../../../Triggers"

import type { TriggerSchemaInitMap, TriggerSchemaAction } from "./types"

export default class TriggerSchema {
    public tableName!: string
    public name!: string
    public event?: TriggerEvent
    public timing?: TriggerTiming
    public orientation?: TriggerOrientation
    public action?: string

    constructor(initMap: TriggerSchemaInitMap) {
        Object.assign(this, initMap)
    }

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

    public createSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CREATE TRIGGER ${this.name}
            ${this.timing} ${this.event} ON ${this.tableName}
            FOR EACH ${this.orientation}
            ${this.action}
        `)
    }

    // ------------------------------------------------------------------------

    public alterSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            ${this.dropSQL()};
            ${this.createSQL()}    
        `)
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return `DROP TRIGGER ${this.name}`
    }

    // ------------------------------------------------------------------------

    public actionSQL(schema?: TriggerSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'ADD': return this.createSQL()
            case 'ALTER': return this.alterSQL()
        }
    }

    // ------------------------------------------------------------------------

    public compare(schema?: TriggerSchema): Omit<TriggerSchemaAction, 'DROP'> {
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

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromTrigger(trigger: Trigger): TriggerSchema {
        return new TriggerSchema({
            tableName: trigger.tableName,
            name: trigger.name,
            event: trigger.event,
            timing: trigger.timing,
            orientation: trigger.orientation,
            action: trigger.actionBody()
        })
    }
}

export {
    type TriggerSchemaInitMap,
    type TriggerSchemaAction
}