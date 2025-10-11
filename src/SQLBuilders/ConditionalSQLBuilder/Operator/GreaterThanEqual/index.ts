import Operator from "../Operator"
import { GTE } from "../Symbols"

export default class GreaterThanEqualOpertor extends Operator<typeof GTE> {
    protected readonly operatorSQL: string = '>='
}