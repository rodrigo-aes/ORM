import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"

export default class WhereSQLBuilder<
    T extends EntityTarget
> extends ConditionalSQLBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}