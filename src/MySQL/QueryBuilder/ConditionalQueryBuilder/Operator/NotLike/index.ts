import Operator from "../Operator"
import { NotLike } from "../Symbols"

export default class NotLikeOperator extends Operator<typeof NotLike> {
    public SQL(): string {
        return `${this.propertyKey} NOT LIKE ${this.value}`
    }
}