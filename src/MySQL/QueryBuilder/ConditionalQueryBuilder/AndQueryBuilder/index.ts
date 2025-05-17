import { EntityMetadata } from "../../../Metadata"

// Operators
import Operator, {
    type OperatorKey,
    type OperatorType,
    type CompatibleOperators
} from "../Operator"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type {
    AndQueryOptions,
    EntityAndQueryOptions,
    RelationAndQueryOptions
} from "./types"
import type { EntityTarget } from "../../../../types/General"
import type { EntityPropertiesKeys } from "../../types"


export default class AndQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    protected propOptions!: EntityAndQueryOptions<InstanceType<T>>
    protected relOptions!: RelationAndQueryOptions

    constructor(
        public target: T,
        public options: AndQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.metadata = this.loadMetadata()

        this.propOptions = this.filterPropetiesOptions()
        this.relOptions = this.filterRelationOptions()

        this.alias = alias ?? this.target.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        const sql = [
            this.propertiesSQL()
        ]
            .join(' AND ')

        return SQLStringHelper.normalizeSQL(sql)
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private propertiesSQL(): string {
        const sql: string[] = []

        for (const [key, value] of Object.entries(this.propOptions))
            sql.push(this.propertySQL(
                key as keyof EntityAndQueryOptions<InstanceType<T>>,
                value!
            ))

        return sql.join(' AND ')
    }

    // ------------------------------------------------------------------------

    private propertySQL<Key extends keyof EntityAndQueryOptions<InstanceType<T>>>(
        columnName: Key,
        value: EntityAndQueryOptions<InstanceType<T>>[Key]
    ): string {
        const column = `${this.alias}.${columnName as string}`
        const isOperator = this.isOperator(value)

        return isOperator
            ? this.operatorSQL(
                columnName as string,
                value as CompatibleOperators<any>
            )
            : `${column} = ${this.propertyValueSQL(value)}`
    }

    // ------------------------------------------------------------------------

    private propertyValueSQL(value: any): string {
        switch (typeof value) {
            case "string": return JSON.stringify(value)

            case "object": return this.objectSQL(value)

            case "number":
            case "bigint":
            case "boolean": return JSON.stringify(value).toUpperCase()
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    private operatorSQL(
        column: string,
        operator: CompatibleOperators<any>
    ): string {
        const key = Object.getOwnPropertySymbols(operator)[0] as (
            keyof CompatibleOperators<any>
        )
        const value = operator[key] as never

        return new Operator[key as OperatorKey](
            this.target,
            value,
            column,
            this.alias
        ).SQL()
    }

    // ------------------------------------------------------------------------

    private objectSQL(object: object): string {
        if (!object) return JSON.stringify(object).toUpperCase()
        if (object instanceof Date) return JSON.stringify(object)

        return `'${JSON.stringify(object)}'`
    }

    // ------------------------------------------------------------------------

    private isOperator(value: any) {
        return (
            value &&
            typeof value === 'object' &&
            Operator.hasOperator(value)
        )
    }

    // ------------------------------------------------------------------------

    private filterPropetiesOptions(): EntityAndQueryOptions<InstanceType<T>> {
        const opts: EntityAndQueryOptions<InstanceType<T>> = {}

        for (const [key, value] of Object.entries(this.options))
            if (this.metadata.columns.some(({ name }) => name === key))
                opts[key as EntityPropertiesKeys<InstanceType<T>>] = value

        return opts
    }

    // ------------------------------------------------------------------------

    private filterRelationOptions(): RelationAndQueryOptions {
        const opts: RelationAndQueryOptions = {}

        for (const [key, value] of Object.entries(this.options)) {
            const shouldInclude = this.metadata.relations?.some(
                ({ name }) => name === (
                    key.includes('.')
                        ? key.split('.')[0]
                        : key
                )
            )

            if (shouldInclude) opts[key] = value
        }

        return opts
    }
}

export {
    type AndQueryOptions
}