import ConditionalSQLBuilder from "../ConditionalSQLBuilder"
import BasePolymorphicEntity from "../../../BasePolymorphicEntity"

import {
    MetadataHandler,

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
import type { Target, TargetMetadata } from "../../../types"
import type { ConditionalQueryOptions } from "../types"

export default class OnSQLBuilder<
    Parent extends Target,
    Related extends Target
> extends ConditionalSQLBuilder<Related> {
    private parentMetadata: TargetMetadata<Parent>

    constructor(
        public parentTarget: Parent,
        public target: Related,
        public relation: RelationMetadataType,
        options?: ConditionalQueryOptions<InstanceType<Related>>,
        public parentAlias: string = parentTarget.name.toLowerCase(),
        alias: string = relation.name,
    ) {
        super(target, options, alias)

        this.parentMetadata = MetadataHandler.targetMetadata(this.parentTarget)
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get relatedPrimary(): string {
        return `${this.alias}.${this.metadata.columns.primary.name}`
    }

    // ------------------------------------------------------------------------

    private get parentPrimary(): string {
        return (
            `${this.parentAlias}.${this.parentMetadata.columns.primary.name}`
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            ON ${this.fixedConditionalSQL()} ${this.conditionalSQL(' AND')}
        `)
    }

    // ------------------------------------------------------------------------

    public fixedConditionalSQL(): string {
        switch (this.relation.type) {
            case "HasOne":
            case "HasMany": return this.fixedHasSQL()

            // ----------------------------------------------------------------

            case "HasOneThrough":
            case "HasManyThrough": return this.fixedHasThroughSQL()

            // ----------------------------------------------------------------

            case "BelongsTo": return this.fixedBelongsTo()

            // ----------------------------------------------------------------

            case "BelongsToThrough": return this.fixedBelongsToThrough()

            // ----------------------------------------------------------------

            case "BelongsToMany": return this.fixedBelongsToMany()

            // ----------------------------------------------------------------

            case "PolymorphicHasOne":
            case "PolymorphicHasMany": return this.fixedPolymorphicHas()

            // ----------------------------------------------------------------

            case "PolymorphicBelongsTo": return (
                this.fixedPolymorphicBelongsTo()
            )
        }
    }

    // Privates ---------------------------------------------------------------
    private fixedHasSQL(): string {
        const { relatedFKName } = this.relation as (
            HasOneMetadata |
            HasManyMetadata
        )

        return `${this.alias}.${relatedFKName} = ${this.parentPrimary}`
    }

    // ------------------------------------------------------------------------

    private fixedHasThroughSQL(): string {
        const {
            relatedTable,
            throughTable,
            throughPrimary,
            relatedFKName,
            throughFKName
        } = this.relation as (
            HasOneThroughMetadata |
            HasManyThroughMetadata
        )

        return `EXISTS (
            SELECT 1 FROM ${relatedTable} ${this.alias} 
                WHERE EXISTS (
                    SELECT 1 FROM ${throughTable}
                        WHERE ${throughFKName} = ${this.parentPrimary}
                        AND ${this.alias}.${relatedFKName} = ${throughPrimary}
                )
        )`
    }

    // ------------------------------------------------------------------------

    private fixedBelongsTo(): string {
        const { FKName } = this.relation as BelongsToMetadata
        return `${this.relatedPrimary} = ${this.parentAlias}.${FKName}`
    }

    // ------------------------------------------------------------------------

    private fixedBelongsToThrough(): string {
        const {
            relatedTable,
            throughTable,
            throughPrimary,
            relatedFKName,
            throughFKName
        } = this.relation as BelongsToThroughMetadata

        return `EXISTS(
            SELECT 1 FROM ${relatedTable} ${this.alias} WHERE EXISTS(
                SELECT 1 FROM ${throughTable}
                WHERE ${throughFKName} = ${this.relatedPrimary}
                AND ${throughPrimary} = ${this.parentAlias}.${relatedFKName}
            )
        )`
    }

    // ------------------------------------------------------------------------

    private fixedBelongsToMany(): string {
        const {
            relatedTable,
            JT,
            parentFKname,
            relatedFKName,
        } = this.relation as (
            BelongsToManyMetadata
        )

        return `EXISTS(
            SELECT 1 FROM ${relatedTable} ${this.alias}
                WHERE EXISTS(
                    SELECT 1 FROM ${JT}
                        WHERE ${parentFKname} = ${this.parentPrimary}
                        AND ${relatedFKName} = ${this.relatedPrimary}
            )
        )`
    }

    // ------------------------------------------------------------------------

    private fixedPolymorphicHas(): string {
        const {
            FKName,
            TKName,
            parentType
        } = this.relation as (
            PolymorphicHasOneMetadata |
            PolymorphicHasManyMetadata
        )

        return `${this.alias}.${FKName} = ${this.parentPrimary}` + (
            TKName
                ? ` AND ${this.parentAlias}.${TKName} = ${(
                    this.resolvePolymorphicParentType(parentType)
                )}`
                : ''
        )
    }

    // ------------------------------------------------------------------------

    private fixedPolymorphicBelongsTo(): string {
        const {
            FKName,
            TKName,
            relatedTable
        } = this.relation as (
            PolymorphicBelongsToMetadata
        )

        const relAlias = this.resolvePolymorphicReletedAlias(relatedTable)

        return `${relAlias}.primaryKey = ${this.parentAlias}.${FKName}` + (
            TKName
                ? ` AND ${relAlias}.entityType = ${this.parentAlias}.${TKName}`
                : ''
        )
    }

    // ------------------------------------------------------------------------

    private resolvePolymorphicParentType(fixedType: string): string {
        return this.parentTarget.isPrototypeOf(BasePolymorphicEntity)
            ? `${this.parentAlias}.entityType`
            : `"${fixedType}"`
    }

    // ------------------------------------------------------------------------

    private resolvePolymorphicReletedAlias(fixedTableName: string): string {
        return this.parentTarget.isPrototypeOf(BasePolymorphicEntity)
            ? this.parentAlias
            : fixedTableName
    }
}