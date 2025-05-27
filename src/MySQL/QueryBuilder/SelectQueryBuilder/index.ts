import { EntityMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

import ConditionalQueryBuilder, { Case } from "../ConditionalQueryBuilder"
import CountQueryBuilder from "../CountQueryBuilder"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../../types/General"
import type { SelectOptions } from "./types"

export default class SelectQueryBuilder<T extends EntityTarget> {
    private metadata: EntityMetadata

    private mergedProperties: string[] = []

    constructor(
        public target: T,
        public options?: SelectOptions<InstanceType<T>>,
        public alias?: string,
    ) {
        this.metadata = this.getMetadata()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetName(): string {
        return this.alias ?? this.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get properties(): string {
        return [
            this.propertiesSQL(),
            ...this.mergedProperties
        ]
            .join(', ')
    }

    // Privates ---------------------------------------------------------------
    private get stringProperties(): string[] {
        return this.options!.properties!.filter(
            option => typeof option === 'string'
        )
    }

    // ------------------------------------------------------------------------

    private get objectProperties(): any[] {
        return this.options!.properties!.filter(
            option => typeof option === 'object'
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public select(options: SelectOptions<InstanceType<T>>) {
        this.options = options
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            SELECT ${this.properties} ${this.countsSQL()} ${this.fromSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string {
        if (this.options?.properties === null) return ''

        return !this.options?.properties
            ? this.allColumnsSQL()
            : this.handlePropertiesSQL()
    }

    // ------------------------------------------------------------------------

    public countsSQL(): string {
        return this.options?.count
            ? new CountQueryBuilder(
                this.target,
                this.options.count,
                this.alias
            )
                .SQL()
            : ''
    }

    // ------------------------------------------------------------------------

    public merge(selectQueryBuilder: SelectQueryBuilder<any>): void {
        this.mergedProperties.push(selectQueryBuilder.propertiesSQL())
    }

    // Privates ---------------------------------------------------------------
    private getMetadata(): EntityMetadata {
        if (this.target === UnionEntity) {
            return Reflect.getOwnMetadata(
                this.alias,
                this.target
            )
        }

        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private handlePropertiesSQL(): string {
        return [
            this.selectedColumnsSQL(),
            this.operatorsPropertiesSQL()
        ]
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private allColumnsSQL(): string {
        return this.metadata.columns.toJSON()
            .map(column => `${this.asColumn(column.name)}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private selectedColumnsSQL(): string {
        return this.stringProperties.includes('*')
            ? this.allColumnsSQL()
            : this.stringProperties
                .map(prop => this.asColumn(prop))
                .join(', ')
    }

    // ------------------------------------------------------------------------

    private operatorsPropertiesSQL(): string {
        return this.objectProperties
            .flatMap(
                prop => Object.getOwnPropertySymbols(prop).map(
                    symbol => {
                        if (symbol === Case) return ConditionalQueryBuilder
                            .case(
                                this.target,
                                prop[symbol],
                                prop.as,
                                this.alias
                            )
                            .SQL()

                        throw new Error
                    }
                )
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private fromSQL(): string {
        return `FROM ${this.metadata.tableName} ${this.targetName}`
    }

    // ------------------------------------------------------------------------

    private asColumn(columnName: string): string {
        return `
            ${this.targetName}.${columnName} 
            AS ${this.targetName}_${columnName}
        `
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static select<T extends EntityTarget>(
        target: T,
        options: SelectOptions<InstanceType<T>>
    ) {
        return new SelectQueryBuilder(target, options)
    }
}

export {
    type SelectOptions
}