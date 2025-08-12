// Operators
import Operator, {
    type OperatorKey,
    type CompatibleOperators
} from "../Operator"

// Symbols
import { Old, New } from "../../../Triggers"

import ExistsSQLBuilder, { Exists } from '../ExistsSQLBuilder'

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { EntityMetadata, EntityUnionMetadata } from "../../../Metadata"
import type {
    AndQueryOptions,
    EntityAndQueryOptions,
    RelationAndQueryOptions
} from "./types"
import type { EntityTarget, EntityUnionTarget } from "../../../../types/General"
import type { EntityPropertiesKeys } from "../../types"
import type { ConditionalQueryOptions } from "../types"
import type UnionSQLBuilder from "../../UnionSQLBuilder"


export default class AndSQLBuilder<T extends EntityTarget | EntityUnionTarget> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    public alias: string

    protected propOptions!: EntityAndQueryOptions<InstanceType<T>>
    protected relOptions!: RelationAndQueryOptions

    private existsSQLBuilder?: ExistsSQLBuilder<T>

    constructor(
        public target: T,
        public options: AndQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = MetadataHandler.loadMetadata(this.target!)

        this.propOptions = this.filterPropetiesOptions()
        this.relOptions = this.filterRelationOptions()
        this.existsSQLBuilder = this.buildExistsSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            [
                ...this.propertiesSQL(),
                ...this.relationsSQL(),
                ...this.existsSQL()
            ]
                .join(' AND ')
        )
    }

    // ------------------------------------------------------------------------

    public unions(): UnionSQLBuilder[] {
        return []
    }

    // Privates ---------------------------------------------------------------
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

        for (const [key, value] of Object.entries(this.relOptions)) (
            sql.push(this.relationSQL(key, value))
        )

        return sql
    }

    // ------------------------------------------------------------------------

    private existsSQL(): string[] {
        return this.existsSQLBuilder
            ? [this.existsSQLBuilder?.SQL()]
            : []
    }

    // ------------------------------------------------------------------------

    private propertySQL<
        Key extends keyof EntityAndQueryOptions<InstanceType<T>>
    >(
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
            : `${column} = ${PropertySQLHelper.valueSQL(value)}`
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
            : (
                typeof value === 'object' &&
                Object.getOwnPropertySymbols(value).some(
                    symbol => [Old, New].includes(symbol)
                )
            )

                ? `${this.alias}.${columnName} = ${(
                    (value as { [Old]: any })[Old]
                    ?? (value as { [New]: any })[New]
                )}`
                : `${this.alias}.${columnName} = ${PropertySQLHelper.valueSQL(value)}`
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

    // ------------------------------------------------------------------------

    private buildExistsSQLBuilder(): ExistsSQLBuilder<T> | undefined {
        const options = this.extractExistsQueryOptions()

        if (options) return new ExistsSQLBuilder(
            this.target,
            options,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    private extractExistsQueryOptions(): (
        string | ConditionalQueryOptions<InstanceType<T>> | undefined
    ) {
        return this.options[Exists]
    }
}

export {
    type AndQueryOptions
}