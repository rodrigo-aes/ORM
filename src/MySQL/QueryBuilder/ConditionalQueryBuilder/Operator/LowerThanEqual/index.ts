import Operator from "../Operator"
import { LTE } from "../Symbols"

export default class LowerThanEqualOperator extends Operator<
    typeof LTE
> {
    public SQL(): string {
        return `${this.propertyKey} <= ${this.handlePrimitive()}`
    }
}