import Operator from "../Operator"
import { LTE } from "../Symbols"

export default class LowerThanEqualOperator extends Operator<typeof LTE> {
    protected readonly operatorSQL: string = '<='
}