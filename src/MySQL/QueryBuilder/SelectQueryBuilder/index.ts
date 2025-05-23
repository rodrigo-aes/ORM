import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

import UnionEntity from "../../UnionEntity"

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
        return SQLStringHelper.normalizeSQL(
            (
                !this.options?.properties ||
                this.options.properties.includes('*')
            )
                ? this.allPropertiesSQL()
                : this.handlePropetiesSQL()
        )
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