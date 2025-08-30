import TriggerSchema from "../../../DatabaseSchema/TriggersSchema/TriggerSchema"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

export default abstract class TriggerSQLBuilder extends TriggerSchema {
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

    public abstract actionSQL(schema?: TriggerSchema): string | undefined
}