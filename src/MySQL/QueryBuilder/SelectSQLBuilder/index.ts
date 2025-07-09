import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

import ConditionalSQLBuilder, { Case } from "../ConditionalSQLBuilder"
import CountSQLBuilder from "../CountSQLBuilder"
import GroupSQLBuilder, {
    type GroupQueryOptions
} from "../GroupSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type {
    SelectOptions,
    SelectPropertyKey,
    SelectCaseClause,
    SelectPropertyOptions
} from "./types"

export default class SelectSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    private metadata: EntityMetadata | EntityUnionMetadata

    private mergedProperties: string[] = []

    constructor(
        public target: T,
        public options?: SelectOptions<InstanceType<T>>,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
        if (!this.alias) this.alias = this.target.name.toLowerCase()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetName(): string {
        return this.alias ?? this.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get properties(): string {
        if (this.options?.properties === '1') return '1'

        return [
            this.propertiesSQL(),
            ...this.mergedProperties
        ]
            .join(', ')
    }

    // Privates ---------------------------------------------------------------
    private get stringProperties(): string[] {
        return (this.options!.properties as string[]).filter(
            option => typeof option === 'string'
        )
    }

    // ------------------------------------------------------------------------

    private get objectProperties(): any[] {
        return (this.options!.properties as string[]).filter(
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
        let counts = this.countsSQL()
        counts = counts ? `, ${counts}` : ''

        return SQLStringHelper.normalizeSQL(`
            SELECT ${this.properties} ${counts} ${this.fromSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string {
        if (this.options?.properties === null) return ''
        if (this.options?.properties === '1') return '1'

        return !this.options?.properties
            ? this.allColumnsSQL()
            : this.handlePropertiesSQL()
    }

    // ------------------------------------------------------------------------

    public countsSQL(): string {
        return this.options?.count
            ? new CountSQLBuilder(
                this.target,
                this.options.count,
                this.alias
            )
                .SQL()
            : ''
    }

    // ------------------------------------------------------------------------

    public merge(selectQueryBuilder: SelectSQLBuilder<any>): void {
        this.mergedProperties.push(selectQueryBuilder.propertiesSQL())
    }

    // ------------------------------------------------------------------------

    public groupQueryBuilder(): GroupSQLBuilder<T> {
        return new GroupSQLBuilder(
            this.target,
            this.groupColumns(),
            this.alias
        )
    }

    // Privates ---------------------------------------------------------------
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
                        if (symbol === Case) return ConditionalSQLBuilder
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
            ${this.alias}.${columnName} 
            AS ${this.alias}_${columnName}
        `
    }

    // ------------------------------------------------------------------------

    private groupColumns(): GroupQueryOptions<InstanceType<T>> {
        return this.options?.properties
            ? this.selectedGroupColumns()
            : this.allGroupColumns()
    }

    // ------------------------------------------------------------------------

    private allGroupColumns(): GroupQueryOptions<InstanceType<T>> {
        return this.metadata.columns.toJSON().map(
            ({ name }) => PropertySQLHelper.pathToAlias(
                name, this.alias
            )
        )
    }

    // ------------------------------------------------------------------------

    private selectedGroupColumns(): GroupQueryOptions<InstanceType<T>> {
        return this.stringProperties.includes('*')
            ? this.allGroupColumns()
            : this.stringProperties.map(prop => PropertySQLHelper.pathToAlias(
                prop, this.alias
            ))
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static select<T extends EntityTarget>(
        target: T,
        options: SelectOptions<InstanceType<T>>
    ) {
        return new SelectSQLBuilder(target, options)
    }
}

export {
    type SelectOptions,
    type SelectPropertyKey,
    type SelectCaseClause,
    type SelectPropertyOptions,
}