import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../../types/General"

export default class WhereSQLBuilder<
    T extends EntityTarget | EntityUnionTarget
> extends ConditionalSQLBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}