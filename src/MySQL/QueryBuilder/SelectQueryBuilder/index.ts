import { EntityMetadata } from "../../Metadata"

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
        private _alias?: string
    ) {
        this.metadata = this.getMetadata()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get alias(): string {
        return this._alias ? `${this.alias}_` : ''
    }

    // ------------------------------------------------------------------------

    public get targetName(): string {
        return this.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get properties(): string {
        return [
            this.propertiesSQL(),
            ...this.mergedProperties
        ]
            .join(', ')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public select(options: SelectOptions<InstanceType<T>>) {
        this.options = options
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            SELECT ${this.properties} ${this.fromSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public propertiesSQL(): string {
        return (
            !this.options?.properties ||
            this.options.properties.includes('*')
        )
            ? this.allPropertiesSQL()
            : this.handlePropetiesSQL()
    }

    // ------------------------------------------------------------------------

    public merge(selectQueryBuilder: SelectQueryBuilder<any>): void {
        this.mergedProperties.push(selectQueryBuilder.propertiesSQL())
    }

    // Privates ---------------------------------------------------------------
    private getMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private allPropertiesSQL(): string {
        return this.metadata.columns.toJSON()
            .map(column => `${this.asColumn(column.name)}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private handlePropetiesSQL(): string {
        return this.options!.properties!
            .flatMap(prop => typeof prop === 'string'
                ? `${this.asColumn(prop)}`
                : []
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private fromSQL(): string {
        return `FROM ${this.metadata.tableName} ${this.targetName}`
    }

    // ------------------------------------------------------------------------

    private asColumn(columnName: string): string {
        return `${columnName} AS ${this.alias}${this.targetName}_${columnName}`
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