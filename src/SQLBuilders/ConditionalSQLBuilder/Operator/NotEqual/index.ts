import Operator from "../Operator"
import { NotEqual } from "../Symbols"

export default class NotEqualOperator extends Operator<typeof NotEqual> {
    protected readonly operatorSQL: string = '!='
}