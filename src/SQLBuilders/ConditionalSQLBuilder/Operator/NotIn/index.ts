import Operator from "../Operator"
import { NotIn } from "../Symbols"
import type { OperatorType } from "../types"

export default class NotInOperator extends Operator<typeof NotIn> {
    public SQL(): string {
        return `
            ${this.propertyKey} NOT IN (
                ${(this.value as OperatorType[typeof NotIn]).join(', ')}
            )
        `
    }
}