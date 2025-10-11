// Helpers
import { PropertySQLHelper } from "../../../Helpers"

import type { Target } from "../../../types"
import type { OperatorType } from "./types"

export default abstract class Operator<T extends keyof OperatorType> {
    constructor(
        public target: Target,
        public value: OperatorType[T],
        public columnName: string,
        public alias: string = target.name.toLowerCase()
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get propertySQL(): string {
        return PropertySQLHelper.pathToAlias(this.columnName, this.alias)
    }

    // ------------------------------------------------------------------------

    protected get valueSQL(): string {
        return PropertySQLHelper.valueSQL(this.value)
    }

    // ------------------------------------------------------------------------

    protected abstract get operatorSQL(): string | undefined

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `${this.propertySQL} ${this.operatorSQL ?? ''} ${this.valueSQL}`
    }
}