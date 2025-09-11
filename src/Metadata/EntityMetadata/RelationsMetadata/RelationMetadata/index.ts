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
    type BelongsToOptions,
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
    RelationMetadataName,
    OneRelationMetadataType,
    ManyRelationMetadatatype,
    RelationJSON
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
        RelationMetadataName
    ) {
        return relation.type
    }

    // ------------------------------------------------------------------------

    public static relationFillMethod(relation: RelationMetadataType): (
        'One' | 'Many'
    ) {
        switch (relation.type) {
            case "HasOne":
            case "HasOneThrough":
            case "BelongsTo":
            case "BelongsToThrough":
            case "PolymorphicHasOne":
            case "PolymorphicBelongsTo": return 'One'

            case "HasMany":
            case "HasManyThrough":
            case "BelongsToMany":
            case "PolymorphicHasMany": return 'Many'
        }
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
}

export {
    type RelationMetadataType,
    type OneRelationMetadataType,
    type ManyRelationMetadatatype,
    type RelationJSON,

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
    type BelongsToOptions as BelongToOptions,
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