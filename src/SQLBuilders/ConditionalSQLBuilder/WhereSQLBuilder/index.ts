import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types"

export default class WhereSQLBuilder<
    T extends EntityTarget | PolymorphicEntityTarget
> extends ConditionalSQLBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}