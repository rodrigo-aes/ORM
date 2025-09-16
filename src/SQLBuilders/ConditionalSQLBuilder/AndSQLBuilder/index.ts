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
import type { EntityMetadata, PolymorphicEntityMetadata } from "../../../Metadata"
import type {
    AndQueryOptions,
    EntityAndQueryOptions,
    RelationAndQueryOptions
} from "./types"
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types/General"
import type { EntityPropertiesKeys } from "../../types"
import type { ConditionalQueryOptions } from "../types"
import type UnionSQLBuilder from "../../UnionSQLBuilder"


export default class AndSQLBuilder<T extends EntityTarget | PolymorphicEntityTarget> {
    protected metadata: EntityMetadata | PolymorphicEntityMetadata

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
        return Object.entries(this.propOptions)
            .map(([key, value]) => this.propertySQL(
                key as keyof EntityAndQueryOptions<InstanceType<T>>,
                value as any
            ))
    }

    // ------------------------------------------------------------------------

    private relationsSQL(): string[] {
        return Object.entries(this.relOptions)
            .map(([key, value]) => this.relationSQL(key, value))
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

        return this.isOperator(value)
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
        const column = parts.pop()
        const alias = `${this.alias}_${parts.join('_')}`

        return this.isOperator(value)
            ? this.operatorSQL(
                column as string,
                value as CompatibleOperators<any>,
                alias
            )
            : `${alias}.${column} = ${PropertySQLHelper.valueSQL(value)}`
    }

    // ------------------------------------------------------------------------

    private operatorSQL(
        column: string,
        operator: CompatibleOperators<any>,
        alias?: string
    ): string {
        const [key] = Object.getOwnPropertySymbols(operator) as (
            (keyof CompatibleOperators<any>)[]
        )

        return new Operator[key as OperatorKey](
            this.target,
            operator[key],
            column,
            alias ?? this.alias
        )
            .SQL()
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
        return Object.fromEntries(Object.entries(this.options).flatMap(
            ([key, value]) => this.metadata.columns.some(
                ({ name }) => name === key
            )
                ? [[key, value]]
                : []
        )) as (
                EntityAndQueryOptions<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    private filterRelationOptions(): RelationAndQueryOptions {
        return Object.fromEntries(Object.entries(this.options).flatMap(
            ([key, value]) => this.metadata.relations?.some(
                ({ name }) => name === (
                    key.includes('.')
                        ? key.split('.')[0]
                        : key
                )
            )
                ? [[key, value]]
                : []
        ))
    }

    // ------------------------------------------------------------------------

    private buildExistsSQLBuilder(): ExistsSQLBuilder<T> | undefined {
        const options = this.options[Exists]

        if (options) return new ExistsSQLBuilder(
            this.target,
            options,
            this.alias
        )
    }
}

export {
    type AndQueryOptions
}