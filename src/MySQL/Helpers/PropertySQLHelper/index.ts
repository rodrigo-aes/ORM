export default class PropertySQLHelper {
    public static pathToAlias(path: string, alias?: string): string {
        if (!path.includes('.')) return `${alias ? `${alias}.` : ''}${path}`

        const parts = path.split('.')
        const column = parts.pop()

        return `${alias ? `${alias}_` : ''}${parts.join('_')}.${column}`
    }

    // ------------------------------------------------------------------------

    public static valueSQL(value: any): string {
        switch (typeof value) {
            case "string": return `'${value}'`

            // ----------------------------------------------------------------

            case "object":
                if (value === null) return 'NULL'
                if (value instanceof Date) return `'${value.toISOString()}'`

                return `'${JSON.stringify(value)}'`

            // ----------------------------------------------------------------

            case "number":
            case "bigint": return value.toString()

            // ----------------------------------------------------------------

            case "boolean": return value ? 'TRUE' : 'FALSE'

            // ----------------------------------------------------------------

            case 'function': return value()

            // ----------------------------------------------------------------

            default: throw new Error
        }
    }
}