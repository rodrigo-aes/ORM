import Operator from "../Operator"
import { LT } from "../Symbols"

export default class LowerThanOperator extends Operator<typeof LT> {
    protected readonly operatorSQL: string = '<'
}