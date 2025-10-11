import Operator from "../Operator"
import { Like } from "../Symbols"

export default class LikeOperator extends Operator<typeof Like> {
    protected readonly operatorSQL: string = 'LIKE'
}