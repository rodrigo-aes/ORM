import Operator from "../Operator"
import { NotNull } from "../Symbols"

export default class NotNullOperator extends Operator<typeof NotNull> {
    public SQL(): string {
        return `${this.propertyKey} IS NOT NULL`
    }
}