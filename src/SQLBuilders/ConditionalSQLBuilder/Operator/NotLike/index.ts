import Operator from "../Operator"
import { NotLike } from "../Symbols"

export default class NotLikeOperator extends Operator<typeof NotLike> {
    protected readonly operatorSQL: string = 'NOT LIKE'
}