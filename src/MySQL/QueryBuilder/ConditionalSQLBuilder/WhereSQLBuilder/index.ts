import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../../types/General"

export default class WhereSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> extends ConditionalSQLBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}