import AbstractRelationMetadata from "./RelationMetadata"

// Objects
import HasOneMetadata, {
    type HasOneOptions,
    type HasOneRelatedGetter
} from "./HasOneMetadata"

import HasManyMetadata, {
    type HasManyOptions,
    type HasManyRelatedGetter
} from "./HasManyMetadata"

import HasOneThroughMetadata, {
    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter
} from "./HasOneThroughMetadata"

import HasManyThroughMetadata, {
    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter
} from "./HasManyThroughMetadata"

import BelongsToMetadata, {
    type BelongToOptions,
    type BelongsToRelatedGetter
} from "./BelongsToMetadata"

import BelongsToThroughMetadata, {
    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter
} from "./BelongsToThroughMetadata"

import BelongsToManyMetadata, {
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter
} from "./BelongsToManyMetadata"

import {
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter
} from "./PolymorphicRelations"

// Types
import type {
    RelatedEntitiesMap,
    RelationMetadataType,
    RelationMetadataTypeName
} from "./types"

export default
    abstract class RelationMetadata extends AbstractRelationMetadata {

    public static HasOne = HasOneMetadata
    public static HasMany = HasManyMetadata
    public static HasOneThrough = HasOneThroughMetadata
    public static HasManyThrough = HasManyThroughMetadata
    public static BelongsTo = BelongsToMetadata
    public static BelongsToThrough = BelongsToThroughMetadata
    public static BelongsToMany = BelongsToManyMetadata

    public static PolymorphicHasOne = PolymorphicHasOneMetadata
    public static PolymorphicHasMany = PolymorphicHasManyMetadata
    public static PolymorphicBelongsTo = PolymorphicBelongsToMetadata

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static relationType(relation: RelationMetadataType): (
        RelationMetadataTypeName
    ) {
        if (this.isHasOne(relation)) return 'HasOne'
        if (this.isHasMany(relation)) return 'HasMany'
        if (this.isHasOneThrough(relation)) return 'HasOneThrough'
        if (this.isHasManyThrough(relation)) return 'HasManyThrough'
        if (this.isBelongsTo(relation)) return 'BelongsTo'
        if (this.isBelongsToThrough(relation)) return 'BelongsToThrough'
        if (this.isBelongsToMany(relation)) return 'BelongsToMany'
        if (this.isPolymorphicHasOne(relation)) return 'PolymorphicHasOne'
        if (this.isPolymorphicHasMany(relation)) return 'PolymorphicHasMany'
        if (this.isPolymorphicBelongsTo(relation)) return 'PolymorphicBelongsTo'

        throw new Error
    }

    // ------------------------------------------------------------------------

    public static isHasOne(relation: RelationMetadataType): boolean {
        return relation instanceof HasOneMetadata
    }

    // ------------------------------------------------------------------------

    public static isHasMany(relation: RelationMetadataType): boolean {
        return relation instanceof HasManyMetadata
    }

    // ------------------------------------------------------------------------

    public static isHasOneThrough(relation: RelationMetadataType): boolean {
        return relation instanceof HasOneThroughMetadata
    }

    // ------------------------------------------------------------------------

    public static isHasManyThrough(relation: RelationMetadataType): boolean {
        return relation instanceof HasManyThroughMetadata
    }

    // ------------------------------------------------------------------------

    public static isBelongsTo(relation: RelationMetadataType): boolean {
        return relation instanceof BelongsToMetadata
    }

    // ------------------------------------------------------------------------

    public static isBelongsToThrough(relation: RelationMetadataType): boolean {
        return relation instanceof BelongsToThroughMetadata
    }

    // ------------------------------------------------------------------------

    public static isBelongsToMany(relation: RelationMetadataType): boolean {
        return relation instanceof BelongsToManyMetadata
    }

    // ------------------------------------------------------------------------

    public static isPolymorphicHasOne(relation: RelationMetadataType): (
        boolean
    ) {
        return relation instanceof PolymorphicHasOneMetadata
    }

    // ------------------------------------------------------------------------

    public static isPolymorphicHasMany(relation: RelationMetadataType): (
        boolean
    ) {
        return relation instanceof PolymorphicHasManyMetadata
    }

    // ------------------------------------------------------------------------

    public static isPolymorphicBelongsTo(relation: RelationMetadataType): (
        boolean
    ) {
        return relation instanceof PolymorphicBelongsToMetadata
    }

    // ------------------------------------------------------------------------

    public static extractEntityTarget(relation: RelationMetadataType) {
        switch (this.relationType(relation)) {
            case "HasOne":
            case "HasMany":
            case "HasOneThrough":
            case "HasManyThrough":
            case "BelongsTo":
            case "BelongsToThrough":
            case "BelongsToMany":
            case "PolymorphicHasOne":
            case "PolymorphicHasMany": return (relation as (
                HasOneMetadata |
                HasManyMetadata |
                HasOneThroughMetadata |
                HasManyThroughMetadata |
                BelongsToMetadata |
                BelongsToThroughMetadata |
                BelongsToManyMetadata |
                PolymorphicHasManyMetadata |
                PolymorphicHasOneMetadata
            ))
                .entity
                .target

            case "PolymorphicBelongsTo": return undefined
        }
    }
}

export {
    type RelationMetadataType,

    HasOneMetadata,
    type HasOneOptions,
    type HasOneRelatedGetter,

    HasManyMetadata,
    type HasManyOptions,
    type HasManyRelatedGetter,

    HasOneThroughMetadata,
    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    HasManyThroughMetadata,
    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    BelongsToMetadata,
    type BelongToOptions,
    type BelongsToRelatedGetter,

    BelongsToThroughMetadata,
    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,

    type RelatedEntitiesMap
}