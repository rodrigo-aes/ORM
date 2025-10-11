import Operator from "../Operator"
import { Between } from "../Symbols"
import { OperatorType } from "../types"

export default class BetweenOperator extends Operator<typeof Between> {
    protected readonly operatorSQL: string = 'BETWEEN'

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected override get valueSQL(): string {
        return this.value.map(val => JSON.stringify(val)).join(' AND ')
    }
}