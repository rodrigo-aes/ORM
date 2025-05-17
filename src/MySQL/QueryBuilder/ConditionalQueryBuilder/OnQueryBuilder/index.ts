import ConditionalQueryBuilder from "../ConditionalQueryBuilder"
import type { ConditionalQueryOptions } from "../types"
import {
    RelationMetadata,
    RelationMetadataType,
    HasOneMetadata,
    HasManyMetadata,
    HasOneThroughMetadata,
    HasManyThroughMetadata
} from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"

export default class OnQueryBuilder<
    T extends EntityTarget
> extends ConditionalQueryBuilder<T> {
    constructor(
        public relation: RelationMetadataType,

        target: T,
        options: ConditionalQueryOptions<InstanceType<T>>,
        alias?: string
    ) {
        super(target, options, alias)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `ON ${this.conditionalSQL()}`
    }

    // ------------------------------------------------------------------------

    public fixedSQL(): string {
        switch (RelationMetadata.relationType(this.relation)) {
            case "HasOne":
            case "HasMany": return this.fixedHasSQL()

            case "HasOneThrough":
            case "HasManyThrough": return this.fixedHasThroughSQL()

            case "BelongsTo":
            case "BelongsToThrough":
            case "BelongsToMany":
            case "PolymorphicHasOne":
            case "PolymorphicHasMany":
            case "PolymorphicBelongsTo":
        }
    }

    // Privates ---------------------------------------------------------------
    private fixedHasSQL(): string {
        const primary = this.metadata.columns.primary
        const { entityName, foreignKey } = this.relation as (
            HasOneMetadata |
            HasManyMetadata
        )

        return `
            ${this.alias}_${entityName}.${foreignKey.name} = 
                ${this.alias}.${primary}
        `
    }

    // ------------------------------------------------------------------------

    private fixedHasThroughSQL(): string {
        const primary = this.metadata.columns.primary
        const {
            entity,
            entityName,
            foreignKey,

            throughEntity,
            throughEntityName,
            throughForeignKey,
        } = this.relation as (
            HasOneThroughMetadata |
            HasManyThroughMetadata
        )
        const throughPrimary = throughEntity.columns.primary

        return `EXISTS(
            SELECT 1 FROM ${entity.tableName} ${entityName} 
                WHERE EXISTS (
                    SELECT 1 FROM ${throughEntity.tableName} ${throughEntityName}
                        WHERE ${throughEntityName}.${throughForeignKey.name} =
                            ${this.alias}.${primary}
                        AND ${entityName}.${foreignKey.name} = 
                            ${throughEntityName}.${throughPrimary}
                )
        )`
    }
}