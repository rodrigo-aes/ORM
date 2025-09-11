import Operator from "../Operator"
import { Or } from "../Symbols"
import OperatorStatic from ".."
import type { CompatibleOperators, OperatorKey } from ".."

export default class OrOperator extends Operator<typeof Or> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.value.map(value => `(${this.handleValue(value)})`)
            .join(' OR ')
    }

    // Privates ---------------------------------------------------------------
    private handleValue(value: any) {
        return this.isOperator()
            ? this.operatorSQL((value as any) as CompatibleOperators<any>)
            : `${this.propertyKey} = ${this.handlePrimitive(value)}`

    }

    // ------------------------------------------------------------------------

    private operatorSQL(
        operator: CompatibleOperators<any>
    ): string {
        const [key, value] = (Object.entries(operator)[0] as unknown as [
            OperatorKey, never
        ])

        return new OperatorStatic[key](
            this.target,
            value,
            this.columnName,
            this.alias
        ).SQL()
    }

    // ------------------------------------------------------------------------

    private isOperator() {
        return (
            this.value &&
            typeof this.value === 'object' &&
            OperatorStatic.hasOperator(this.value)
        )
    }
} 