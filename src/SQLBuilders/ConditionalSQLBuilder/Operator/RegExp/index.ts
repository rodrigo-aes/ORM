import Operator from "../Operator"
import { RegExp } from "../Symbols"

export default class RegExpOperator extends Operator<typeof RegExp> {
    protected readonly operatorSQL: string = 'REGEXP'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get valueSQL(): string {
        return typeof this.value === 'string'
            ? this.value
            : JSON.stringify(this.value)
    }
}