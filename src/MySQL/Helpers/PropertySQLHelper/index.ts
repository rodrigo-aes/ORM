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
            case "string": return JSON.stringify(value)

            case "object":
                if (!value) return JSON.stringify(value).toUpperCase()
                if ((value as any) instanceof Date) return JSON.stringify(
                    value
                )

                return `'${JSON.stringify(value)}'`

            case "number":
            case "bigint":
            case "boolean": return JSON.stringify(value).toUpperCase()

            default: throw new Error
        }
    }
}