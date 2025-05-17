import Operator from "../Operator"
import { GT } from "../Symbols"

export default class GreaterThanOpertor extends Operator<
    typeof GT
> {
    public SQL(): string {
        return `${this.propertyKey} > ${this.handlePrimitive()}`
    }
}