import Operator from "../Operator"
import { LT } from "../Symbols"

export default class LowerThanOperator extends Operator<
    typeof LT
> {
    public SQL(): string {
        return `${this.propertyKey} < ${this.handlePrimitive()}`
    }
}