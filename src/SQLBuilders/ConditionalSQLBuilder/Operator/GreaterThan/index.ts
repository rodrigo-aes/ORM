import Operator from "../Operator"
import { GT } from "../Symbols"

export default class GreaterThanOpertor extends Operator<typeof GT> {
    protected readonly operatorSQL: string = '>'
}