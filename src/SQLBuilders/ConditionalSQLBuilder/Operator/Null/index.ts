import Operator from "../Operator"
import { Null } from "../Symbols"

export default class NullOperator extends Operator<typeof Null> {
    protected readonly operatorSQL: string = 'IS NULL'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get valueSQL(): string {
        return ''
    }
}