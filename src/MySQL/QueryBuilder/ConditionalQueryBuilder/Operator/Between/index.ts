import Operator from "../Operator"
import { Between } from "../Symbols"
import { OperatorType } from "../types"

export default class BetweenOperator extends Operator<typeof Between> {
    public SQL(): string {
        const [init, end] = (this.value as OperatorType[typeof Between])

        return `
            ${this.propertyKey} 
                BETWEEN ${JSON.stringify(init)} AND ${JSON.stringify(end)}
        `
    }
}