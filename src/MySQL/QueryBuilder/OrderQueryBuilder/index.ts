import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { OrderQueryOptions, OrderQueryOption } from "./types"

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
            ORDER BY ${this.propertiesSQL()}    
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

    private propertiesSQL(): string {
        return this.isMultipleOptions()
            ? this.options.map(option => this.propertySQL(
                option as OrderQueryOption<any>
            ))
                .join(', ')

            : this.propertySQL(this.options as OrderQueryOption<any>)
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
        const [first] = this.options

        return Array.isArray(first)
            ? true
            : false
    }
}