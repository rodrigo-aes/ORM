import type { EntityTarget } from "../../../../types/General"
import type { OperatorType, Primitive } from "./types"

export default abstract class Operator<T extends keyof OperatorType> {
    public alias: string

    constructor(
        public target: EntityTarget,
        public value: OperatorType[T],
        public columnName: string,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get propertyKey(): string {
        return `${this.alias}.${this.propertyName}`
    }

    // ------------------------------------------------------------------------

    public get propertyName(): string {
        return this.handlePropertyPath(this.columnName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract SQL(): string

    // Protected --------------------------------------------------------------
    protected handlePrimitive(value?: Primitive): string {
        value = value ?? this.value

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

    // ------------------------------------------------------------------------

    protected handleRegExp(): string {
        switch (typeof (this.value as RegExp | string)) {
            case "string": return this.value
            case "object": return (this.value as RegExp).toString()
        }
    }


    protected handlePropertyPath(path: string): string {
        if (!path.includes('.')) return path

        const parts = path.split('.')
        const column = parts.pop()

        return `${parts.join('_')}.${column}`
    }
}