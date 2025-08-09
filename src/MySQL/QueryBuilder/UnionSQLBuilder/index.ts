import {
    EntityUnionMetadata,
    type UnionColumnMetadata
} from "../../Metadata"

import type { EntityMetadata } from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { UnionEntityTarget } from "../../../types/General"

export default class UnionSQLBuilder {
    protected metadata: EntityUnionMetadata

    constructor(
        public name: string,
        public target: UnionEntityTarget
    ) {
        this.metadata = this.loadMetadata()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get entities(): EntityMetadata[] {
        return Object.values(this.metadata.sourcesMetadata)
    }

    // ------------------------------------------------------------------------

    private get restColumns(): UnionColumnMetadata[] {
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
    private loadMetadata(): EntityUnionMetadata {
        return EntityUnionMetadata.find(this.target)!
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
        return this.restColumns.map(
            column => {
                const entityColumn = entity.columns.find(
                    ({ name }) => name === column.name
                )

                return !!entityColumn
                    ? `${entityColumn.name} AS ${column.name}`
                    : `NULL AS ${column.name}`
            }
        )
    }
}