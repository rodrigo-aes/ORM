import Operator from "../Operator"
import { NotRegExp } from "../Symbols"

export default class NotRegExpOperator extends Operator<typeof NotRegExp> {
    public SQL(): string {
        return `${this.propertyKey} NOT REGEXP ${this.handleRegExp()}`
    }
}