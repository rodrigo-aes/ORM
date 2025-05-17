import Operator from "../Operator"
import { NotEqual } from "../Symbols"

export default class NotEqualOperator extends Operator<typeof NotEqual> {
    public SQL(): string {
        return `${this.propertyKey} != ${this.handlePrimitive()}`
    }
}