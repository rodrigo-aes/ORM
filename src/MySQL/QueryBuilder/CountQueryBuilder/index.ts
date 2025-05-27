import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

// Query Builder
import ConditionalQueryBuilder, {
    Case,
    type ConditionalQueryOptions,
    type CaseQueryOptions,
} from "../ConditionalQueryBuilder"

import FindQueryBuilder from "../FindQueryBuilder"

// Helpers
import { PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { CountQueryOptions, CountCaseOptions } from "./types"


export default class CountQueryBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    public alias: string

    constructor(
        public target: T,
        public options: CountQueryOptions<InstanceType<T>>,
        alias?: string,
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return Object.entries(this.options)
            .map(([as, options]) => {
                switch (typeof options) {
                    case "string": return `
                        COUNT (${this.propertySQL(options)}) ${this.asSQL(as)}
                    `

                    case "object": return `
                        ${this.handleConditionalCountType(
                        options
                    )} ${this.asSQL(as)}
                    `
                }
            })
            .join(', ')
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

    private propertySQL(property: string): string {
        return property === '*'
            ? property
            : PropertySQLHelper.pathToAlias(property, this.alias)
    }

    // ------------------------------------------------------------------------

    private asSQL(as: string): string {
        return `AS ${as}`
    }

    // ------------------------------------------------------------------------

    private handleConditionalCountType(
        options: (
            ConditionalQueryOptions<InstanceType<T>> |
            CountCaseOptions<InstanceType<T>>
        )
    ): string {
        if (Object.getOwnPropertySymbols(options).includes(Case)) return (
            `COUNT (${this.caseOperatorSQL(
                options as CountCaseOptions<InstanceType<T>>
            )})`
        )

        else return `(
            SELECT COUNT(*) 
            FROM ${this.metadata.tableName}
            ${this.conditionalSQL(
            options as ConditionalQueryOptions<InstanceType<T>>
        )})`
    }

    // ------------------------------------------------------------------------

    private caseOperatorSQL(options: CountCaseOptions<InstanceType<T>>): (
        string
    ) {
        return ConditionalQueryBuilder.case(
            this.target,
            options[Case],
            undefined,
            this.alias
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private conditionalSQL(
        options: ConditionalQueryOptions<InstanceType<T>>
    ): string {
        return ConditionalQueryBuilder.where(
            this.target,
            options,
            this.alias
        )
            .SQL()
    }
}

export {
    type CountQueryOptions
}