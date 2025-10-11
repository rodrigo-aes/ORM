import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Types
import type { Target } from "../../../types"

export default class WhereSQLBuilder<
    T extends Target
> extends ConditionalSQLBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}