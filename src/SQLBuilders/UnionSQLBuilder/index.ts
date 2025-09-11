import {
    PolymorphicEntityMetadata,
    type PolymorphicColumnMetadata
} from "../../Metadata"

import type { EntityMetadata } from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { PolymorphicEntityTarget } from "../../types/General"

export default class UnionSQLBuilder {
    protected metadata: PolymorphicEntityMetadata

    constructor(
        public name: string,
        public target: PolymorphicEntityTarget
    ) {
        this.metadata = this.loadMetadata()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get entities(): EntityMetadata[] {
        return Object.values(this.metadata.sourcesMetadata)
    }

    // ------------------------------------------------------------------------

    private get restColumns(): PolymorphicColumnMetadata[] {
        return [...this.metadata.columns].filter(
            ({ primary, name }) => !primary && name !== 'entityType'
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            `WITH ${this.name} AS (${this.tablesSQL()})`
        )
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): PolymorphicEntityMetadata {
        return PolymorphicEntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private tablesSQL(): string {
        return this.entities.map(entity => this.targetTableSQL(entity))
            .join(' UNION ALL ')
    }

    // ------------------------------------------------------------------------

    private targetTableSQL(entity: EntityMetadata): string {
        return `
            SELECT ${this.propertiesSQL(entity)} FROM ${entity.tableName}
        `
    }

    // ------------------------------------------------------------------------

    private propertiesSQL(entity: EntityMetadata): string {
        return [
            this.primaryKeySQL(entity),
            this.targetTypeSQL(entity),
            ...this.restPropertiesSQL(entity)
        ]
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private primaryKeySQL(entity: EntityMetadata): string {
        return `${entity.columns.primary.name} AS primaryKey`
    }

    // ------------------------------------------------------------------------

    private targetTypeSQL(entity: EntityMetadata): string {
        return `"${entity.target.name}" AS entityType`
    }

    // ------------------------------------------------------------------------

    private restPropertiesSQL(entity: EntityMetadata): string[] {
        return this.restColumns.map(column => {
            const sourceColumn = column.targetSource(entity.target)?.name

            return sourceColumn
                ? `${sourceColumn} AS ${column.name}`
                : `NULL AS ${column.name}`
        })
    }
}