import Operator from "../Operator"
import { Null } from "../Symbols"

export default class NullOperator extends Operator<typeof Null> {
    public SQL(): string {
        return `${this.propertyKey} IS NULL`
    }
}