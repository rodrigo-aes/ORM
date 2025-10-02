import MetadataArray from "../../MetadataArray"

import RelationMetadata, {
    type RelationJSON,
    type RelationMetadataType,
    type OneRelationMetadataType,
    type ManyRelationMetadatatype,

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
} from "./RelationMetadata"

import type { RelationsMetadataJSON } from "./types"
import type { EntityTarget } from "../../../types"

// Exceptions
import type { MetadataErrorCode } from "../../../Errors"

export default class RelationsMetadata extends MetadataArray<
    RelationMetadata
> {
    protected static override readonly KEY: string = 'relations-metadata'
    protected readonly KEY: string = RelationsMetadata.KEY

    protected readonly SEARCH_KEYS: (keyof RelationMetadata)[] = [
        'name', 'relatedTarget'
    ]
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_RELATION'
    )

    declare public target: EntityTarget

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public addHasOne(options: HasOneOptions) {
        this.push(new RelationMetadata.HasOne(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasMany(options: HasManyOptions) {
        this.push(new RelationMetadata.HasMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasOneThrough(options: HasOneThroughOptions) {
        this.push(new RelationMetadata.HasOneThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addHasManyThrough(options: HasManyThroughOptions) {
        this.push(new RelationMetadata.HasManyThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsTo(options: BelongToOptions) {
        this.push(new RelationMetadata.BelongsTo(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsToThrough(options: BelongsToThroughOptions) {
        this.push(new RelationMetadata.BelongsToThrough(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addBelongsToMany(options: BelongsToManyOptions) {
        this.push(new RelationMetadata.BelongsToMany(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicHasOne(options: PolymorphicChildOptions) {
        this.push(new RelationMetadata.PolymorphicHasOne(this.target, options))
    }

    // ------------------------------------------------------------------------

    public addPolymorphicHasMany(options: PolymorphicChildOptions) {
        this.push(
            new RelationMetadata.PolymorphicHasMany(this.target, options)
        )
    }

    // ------------------------------------------------------------------------

    public addPolymorphicBelongsTo(options: PolymorphicParentOptions) {
        this.push(
            new RelationMetadata.PolymorphicBelongsTo(this.target, options)
        )
    }
}

export {
    RelationMetadata,
    type OneRelationMetadataType,
    type ManyRelationMetadatatype,
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

    type RelatedEntitiesMap,

    type RelationJSON,
    type RelationsMetadataJSON,
}