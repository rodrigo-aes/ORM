import Operator from "../Operator"
import { RegExp } from "../Symbols"

export default class RegExpOperator extends Operator<typeof RegExp> {
    public SQL(): string {
        return `REGEXP ${this.handleRegExp()}`
    }
}