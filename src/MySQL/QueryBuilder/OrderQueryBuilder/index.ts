import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Query Builders
import ConditionalQueryBuilder, { Case } from "../ConditionalQueryBuilder"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    OrderQueryOptions,
    OrderQueryOption,
    OrderCaseOption
} from "./types"

export default class OrderQueryBuilder<T extends EntityTarget> {
    private metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public options: OrderQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            ORDER BY ${this.orderClauseSQL()}    
        `)
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        if (this.target === UnionEntity) {
            return Reflect.getOwnMetadata(
                this.alias,
                this.target
            )
        }

        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private orderClauseSQL(): string {
        if (Array.isArray(this.options)) return this.propertiesSQL()
        return this.operatorSQL()
    }

    // ------------------------------------------------------------------------

    private propertiesSQL(): string {
        return this.isMultipleOptions()
            ? (this.options as (
                OrderQueryOption<InstanceType<T>> |
                OrderQueryOption<InstanceType<T>>[]
            ))
                .map(option => this.propertySQL(
                    option as OrderQueryOption<any>
                ))
                .join(', ')

            : this.propertySQL(this.options as OrderQueryOption<any>)
    }

    // ------------------------------------------------------------------------

    private operatorSQL(): string {
        return Object.getOwnPropertySymbols(this.options)
            .map(symbol => {
                if (symbol === Case) return ConditionalQueryBuilder
                    .case(
                        this.target,
                        (
                            this.options as (
                                OrderCaseOption<InstanceType<T>>
                            )
                        )[Case],
                        undefined,
                        this.alias
                    )
                    .SQL()

                throw new Error
            })
            .join('')
    }

    // ------------------------------------------------------------------------

    private propertySQL(option: OrderQueryOption<any>): string {
        let [property, direction] = option

        property = property.includes('.')
            ? this.handleRelationOptionPath(property)
            : this.handlePropertyOptionName(property)

        return `${property} ${direction}`
    }

    // ------------------------------------------------------------------------

    private handlePropertyOptionName(columnName: string): string {
        return `${this.alias}.${columnName}`
    }

    // ------------------------------------------------------------------------

    private handleRelationOptionPath(path: string): string {
        const parts = path.split('.')
        const columnName = parts.pop()

        return `${this.alias}_${parts.join('_')}.${columnName}`
    }

    // ------------------------------------------------------------------------

    private isMultipleOptions(): boolean {
        const [first] = this.options as (
            OrderQueryOption<InstanceType<T>> |
            OrderQueryOption<InstanceType<T>>[]
        )

        return Array.isArray(first)
            ? true
            : false
    }
}