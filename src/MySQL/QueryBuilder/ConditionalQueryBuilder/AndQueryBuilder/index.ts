import { EntityMetadata } from "../../../Metadata"
import UnionEntity from "../../../UnionEntity"

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
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()

        this.propOptions = this.filterPropetiesOptions()
        this.relOptions = this.filterRelationOptions()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            [
                ...this.propertiesSQL(),
                ...this.relationsSQL()
            ]
                .join(' AND ')
        )
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        // if (this.target === UnionEntity) {
        //     return Reflect.getOwnMetadata(
        //         this.alias,
        //         this.target
        //     )
        // }

        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private propertiesSQL(): string[] {
        const sql: string[] = []

        for (const [key, value] of Object.entries(this.propOptions))
            sql.push(
                this.propertySQL(
                    key as keyof EntityAndQueryOptions<InstanceType<T>>,
                    value!
                )
            )

        return sql
    }

    // ------------------------------------------------------------------------

    private relationsSQL(): string[] {
        const sql: string[] = []

        for (const [key, value] of Object.entries(this.relOptions))
            sql.push(
                this.relationSQL(key, value)
            )

        return sql
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

    private relationSQL(
        path: string,
        value: EntityAndQueryOptions<InstanceType<any>>
    ): string {
        const parts = path.split('.')
        const columnName = parts.pop()
        const alias = `${this.alias}_${parts.join('_')}`

        const isOperator = this.isOperator(value)

        return isOperator
            ? this.operatorSQL(
                columnName as string,
                value as CompatibleOperators<any>,
                alias
            )
            : `${alias}.${columnName} = ${this.propertyValueSQL(value)}`
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
        operator: CompatibleOperators<any>,
        alias?: string
    ): string {
        const key = Object.getOwnPropertySymbols(operator)[0] as (
            keyof CompatibleOperators<any>
        )
        const value = operator[key] as never

        return new Operator[key as OperatorKey](
            this.target,
            value,
            column,
            alias ?? this.alias
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