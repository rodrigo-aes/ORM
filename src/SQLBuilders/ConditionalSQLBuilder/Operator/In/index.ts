import Operator from "../Operator"
import { In } from "../Symbols"

export default class InOperator extends Operator<typeof In> {
    public get values(): string {
        return this.value.map(v => this.handlePrimitive(v)).join(', ')
    }

    public SQL(): string {
        return `${this.propertyKey} IN (${this.values})`
    }
}