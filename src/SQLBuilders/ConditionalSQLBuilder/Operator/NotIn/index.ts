import Operator from "../Operator"
import { NotIn } from "../Symbols"

// Helpers
import { PropertySQLHelper } from "../../../../Helpers"

export default class NotInOperator extends Operator<typeof NotIn> {
    protected readonly operatorSQL: string = 'NOT IN'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get valueSQL(): string {
        return `(${(
            this.value
                .map(val => PropertySQLHelper.valueSQL(val))
                .join(', ')
        )})`
    }
}