import Operator from "../Operator"
import { Equal } from "../Symbols"

export default class EqualOperator extends Operator<typeof Equal> {
    protected readonly operatorSQL: string = '='
} 