import Operator from "../Operator"
import { NotNull } from "../Symbols"

export default class NotNullOperator extends Operator<typeof NotNull> {
    protected readonly operatorSQL: string = 'IS NOT NULL'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    public get valueSQL(): string {
        return ''
    }
}