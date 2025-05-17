import Operator from "../Operator"
import { In } from "../Symbols"
import type { OperatorType } from "../types"

export default class InOperator extends Operator<typeof In> {
    public SQL(): string {
        return `
            ${this.propertyKey}
                IN (${(this.value as OperatorType[typeof In]).join(', ')})
        `
    }
}