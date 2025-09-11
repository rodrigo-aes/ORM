import { Operator, type CompatibleOperators } from "../../SQLBuilders"
import { Old, New } from "../../Triggers"

export default class PropertySQLHelper {
    public static pathToAlias(path: string, alias?: string): string {
        if (!path.includes('.')) return `${alias ? `${alias}.` : ''}${path}`

        const parts = path.split('.')
        const column = parts.pop()

        return `${alias ? `${alias}_` : ''}${parts.join('_')}.${column}`
    }

    // ------------------------------------------------------------------------

    public static valueSQL(value: any): (
        string
    ) {
        switch (typeof value) {
            case "string": return `'${value}'`

            // ----------------------------------------------------------------

            case "object": switch (true) {
                case value === null: return 'NULL'
                case value instanceof Date: return `'${value.toISOString()}'`
                case this.hasSymbols(value): return this.handleSymbolValue(
                    value
                )

                default: return `'${JSON.stringify(value)}'`
            }

            // ----------------------------------------------------------------

            case "number":
            case "bigint": return value.toString()

            // ----------------------------------------------------------------

            case "boolean": return value ? 'TRUE' : 'FALSE'

            // ----------------------------------------------------------------

            case 'function': return this.valueSQL(value())

            // ----------------------------------------------------------------

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private static hasSymbols(value: any): boolean {
        return Object.getOwnPropertySymbols(value).length > 0
    }

    // ------------------------------------------------------------------------

    private static symbolsAs(symbols: Symbol[], as: Symbol[]): boolean {
        return symbols.some(symbol => as.includes(symbol))
    }

    // ------------------------------------------------------------------------

    private static handleSymbolValue(
        value: any
    ): any {
        const symbols = Object.getOwnPropertySymbols(value)

        switch (true) {
            case this.symbolsAs(symbols, [Old, New]): return (
                value[Old] ?? value[New]
            )

            default: throw new Error
        }
    }
}