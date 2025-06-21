import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

import {
    RelationMetadata,

    type RelationMetadataType,
    type HasOneMetadata,
    type HasManyMetadata,
    type HasOneThroughMetadata,
    type HasManyThroughMetadata,
    type BelongsToMetadata,
    type BelongsToThroughMetadata,
    type BelongsToManyMetadata,
    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata
} from "../../../Metadata"

// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../../types/General"
import type { ConditionalQueryOptions } from "../types"

export default class OnSQLBuilder<
    T extends EntityTarget | UnionEntityTarget
> extends ConditionalSQLBuilder<T> {
    constructor(
        public relation: RelationMetadataType,
        public parentAlias: string,
        alias: string,

        target: T,
        options?: ConditionalQueryOptions<InstanceType<T>>,
    ) {
        super(target, options, alias)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        const fixedRelationSQL = this.fixedSQL()
        const conditionalSQL = this.conditionalSQL()

        return SQLStringHelper.normalizeSQL(`
            ON ${fixedRelationSQL}
            ${conditionalSQL ? ` AND ${conditionalSQL}` : ''}
        `)
    }

    // ------------------------------------------------------------------------

    public fixedSQL(): string {
        switch (RelationMetadata.relationType(this.relation)) {
            case "HasOne":
            case "HasMany": return this.fixedHasSQL()

            case "HasOneThrough":
            case "HasManyThrough": return this.fixedHasThroughSQL()

            case "BelongsTo": return this.fixedBelongsTo()

            case "BelongsToThrough": return this.fixedBelongsToThrough()

            case "BelongsToMany": return this.fixedBelongsToMany()

            case "PolymorphicHasOne":
            case "PolymorphicHasMany": return this.fixedPolymorphicHas()

            case "PolymorphicBelongsTo": return this.fixedPolymorphicBelongsTo()
        }
    }

    // Privates ---------------------------------------------------------------
    private fixedHasSQL(): string {
        const primary = this.metadata.columns.primary.name
        const { foreignKey } = this.relation as (
            HasOneMetadata |
            HasManyMetadata
        )

        return `
            ${this.alias}.${foreignKey.name} = 
                ${this.parentAlias}.${primary}
        `
    }

    // ------------------------------------------------------------------------

    private fixedHasThroughSQL(): string {
        const primary = this.metadata.columns.primary.name
        const {
            entity,
            foreignKey,

            throughEntity,
            throughEntityName,
            throughForeignKey,
        } = this.relation as (
            HasOneThroughMetadata |
            HasManyThroughMetadata
        )
        const throughPrimary = throughEntity.columns.primary.name

        return `EXISTS(
            SELECT 1 FROM ${entity.tableName} ${this.alias} 
                WHERE EXISTS (
                    SELECT 1 FROM ${throughEntity.tableName} ${throughEntityName}
                        WHERE ${throughEntityName}.${throughForeignKey.name} =
                            ${this.parentAlias}.${primary}
                        AND ${this.alias}.${foreignKey.name} = 
                            ${throughEntityName}.${throughPrimary}
                )
        )`
    }

    // ------------------------------------------------------------------------

    private fixedBelongsTo(): string {
        const { entity, foreignKey } = this.relation as (
            BelongsToMetadata
        )
        const entityPrimary = entity.columns.primary.name

        return `
            ${this.alias}.${entityPrimary} =
            ${this.parentAlias}.${foreignKey.name} 
        `
    }

    // ------------------------------------------------------------------------

    private fixedBelongsToThrough(): string {
        const {
            entity,
            foreignKey,

            throughEntity,
            throughEntityName,
            throughForeignKey
        } = this.relation as (
            BelongsToThroughMetadata
        )
        const entityPrimary = entity.columns.primary.name
        const throughPrimary = throughEntity.columns.primary.name

        return `EXISTS(
            SELECT 1 FROM ${entity.tableName} ${this.alias}
                WHERE EXISTS (
                    SELECT 1 FROM ${throughEntity.tableName} ${throughEntityName}
                        WHERE ${throughEntityName}.${throughForeignKey.name} =
                            ${this.alias}.${entityPrimary}
                        AND ${throughEntityName}.${throughPrimary} =
                            ${this.parentAlias}.${foreignKey.name}
                )
        )`
    }

    // ------------------------------------------------------------------------

    private fixedBelongsToMany(): string {
        const {
            joinTable,

            entity,
            entityForeignKey,

            targetForeignKey
        } = this.relation as (
            BelongsToManyMetadata
        )

        const primary = this.metadata.columns.primary.name
        const entityPrimary = entity.columns.primary.name
        const joinTableAlias = `${joinTable.tableName}_jt`

        return `EXISTS(
            SELECT 1 FROM ${entity.tableName} ${this.alias}
                WHERE EXISTS(
                    SELECT 1 FROM ${joinTable.tableName} ${joinTableAlias}
                        WHERE ${joinTableAlias}.${entityForeignKey.name} =
                            ${this.alias}.${entityPrimary}
                        AND ${joinTableAlias}.${targetForeignKey.name} = 
                            ${this.parentAlias}.${primary}
                )
        )`
    }

    // ------------------------------------------------------------------------

    private fixedPolymorphicHas(): string {
        const {
            foreignKey,
            typeKey,
            targetType
        } = this.relation as (
            PolymorphicHasOneMetadata |
            PolymorphicHasManyMetadata
        )
        const primary = this.metadata.columns.primary.name

        return `
            ${this.alias}.${foreignKey.name} = ${this.parentAlias}.${primary}
            AND ${this.alias}.${typeKey} = "${targetType}"
        `
    }

    // ------------------------------------------------------------------------

    private fixedPolymorphicBelongsTo(): string {
        const {
            foreignKey,
            typeKey,
            unionName
        } = this.relation as (
            PolymorphicBelongsToMetadata
        )

        return `
            ${unionName}.primaryKey = ${this.parentAlias}.${foreignKey.name}
            AND ${unionName}.entityType = ${this.parentAlias}.${typeKey}
        `
    }
}