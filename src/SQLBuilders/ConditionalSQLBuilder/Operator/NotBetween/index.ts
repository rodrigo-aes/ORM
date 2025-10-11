import Operator from "../Operator"
import { NotBetween } from "../Symbols"
import { OperatorType } from "../types"

export default class NotBetweenOperator extends Operator<typeof NotBetween> {
    protected readonly operatorSQL: string = 'NOT BETWEEN'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get valueSQL(): string {
        return this.value.map(val => JSON.stringify(val)).join(' AND ')
    }
}