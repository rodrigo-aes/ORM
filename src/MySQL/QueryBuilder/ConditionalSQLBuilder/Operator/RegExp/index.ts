import Operator from "../Operator"
import { Regex } from "../Symbols"

export default class RegExpOperator extends Operator<typeof Regex> {
    public SQL(): string {
        return `REGEXP ${this.handleRegExp()}`
    }
}