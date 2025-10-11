import Operator from "../Operator"
import { In } from "../Symbols"

// Hepers
import { PropertySQLHelper } from "../../../../Helpers"

export default class InOperator extends Operator<typeof In> {
    protected readonly operatorSQL: string = 'IN'

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