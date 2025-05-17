import Operator from "../Operator"
import { Equal } from "../Symbols"

export default class EqualOperator extends Operator<typeof Equal> {
    public SQL(): string {
        return `${this.propertyKey} = ${this.handlePrimitive()}`
    }
} 