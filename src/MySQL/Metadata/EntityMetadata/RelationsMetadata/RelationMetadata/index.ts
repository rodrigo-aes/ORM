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
    PolymorphicHasOneMetdata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter
} from "./PolymorphicRelations"

// Types
import type { RelatedEntitiesMap } from "./types"

export default
    abstract class RelationMetadata extends AbstractRelationMetadata {

    public static HasOne = HasOneMetadata
    public static HasMany = HasManyMetadata
    public static HasOneThrough = HasOneThroughMetadata
    public static HasManyThrough = HasManyThroughMetadata
    public static BelongsTo = BelongsToMetadata
    public static BelongsToThrough = BelongsToThroughMetadata
    public static BelongsToMany = BelongsToManyMetadata

    public static PolymorphicHasOne = PolymorphicHasOneMetdata
    public static PolymorphicHasMany = PolymorphicHasManyMetadata
    public static PolymorphicBelongsTo = PolymorphicBelongsToMetadata
}

export type {
    HasOneOptions,
    HasOneRelatedGetter,

    HasManyOptions,
    HasManyRelatedGetter,

    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter,

    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter,

    BelongToOptions,
    BelongsToRelatedGetter,

    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,

    BelongsToManyMetadata,
    BelongsToManyOptions,
    BelongsToManyRelatedGetter,

    PolymorphicParentOptions,
    PolymorphicParentRelatedGetter,

    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter,

    RelatedEntitiesMap
}