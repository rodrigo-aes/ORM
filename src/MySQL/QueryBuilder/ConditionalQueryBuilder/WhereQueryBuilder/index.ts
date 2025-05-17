import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Types
import type { EntityTarget } from "../../../../types/General"

export default class WhereQueryBuilder<
    T extends EntityTarget
> extends ConditionalQueryBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}