import Operator from "../Operator"
import { Like } from "../Symbols"

export default class LikeOperator extends Operator<typeof Like> {
    public SQL(): string {
        return `${this.propertyKey} LIKE ${this.value}`
    }
}