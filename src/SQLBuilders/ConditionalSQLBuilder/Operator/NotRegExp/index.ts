import Operator from "../Operator"
import { NotRegExp } from "../Symbols"

export default class NotRegExpOperator extends Operator<typeof NotRegExp> {
    protected readonly operatorSQL: string = 'NOT REGEXP'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get valueSQL(): string {
        return typeof this.value === 'string'
            ? this.value
            : JSON.stringify(this.value)
    }
}