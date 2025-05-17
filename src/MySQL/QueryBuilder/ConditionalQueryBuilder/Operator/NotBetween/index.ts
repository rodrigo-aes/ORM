import Operator from "../Operator"
import { NotBetween } from "../Symbols"
import { OperatorType } from "../types"

export default class NotBetweenOperator extends Operator<typeof NotBetween> {
    public SQL(): string {
        const [init, end] = (this.value as OperatorType[typeof NotBetween])
        return `${this.propertyKey} 
            NOT BETWEEN ${JSON.stringify(init)} AND ${JSON.stringify(end)}
        `
    }
}