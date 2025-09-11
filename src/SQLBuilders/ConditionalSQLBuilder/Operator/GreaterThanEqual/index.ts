import Operator from "../Operator"
import { GTE } from "../Symbols"

export default class GreaterThanEqualOpertor extends Operator<
    typeof GTE
> {
    public SQL(): string {
        return `${this.propertyKey} >= ${this.handlePrimitive()}`
    }
}