import RelationMetadata, {
    type RelationMetadataType,

    type HasOneMetadata,
    type HasOneOptions,
    type HasOneRelatedGetter,

    type HasManyMetadata,
    type HasManyOptions,
    type HasManyRelatedGetter,

    type HasOneThroughMetadata,
    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    type HasManyThroughMetadata,
    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    type BelongsToMetadata,
    type BelongToOptions,
    type BelongsToRelatedGetter,

    type BelongsToThroughMetadata,
    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    type BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,

    type RelatedEntitiesMap
} from "./RelationMetadata"

import type { EntityTarget } from "../../../../types/General"

export default class RelationsMetadata extends Array<RelationMetadata> {
    constructor(
        public target: EntityTarget,
        ...relations: RelationMetadata[]
    ) {
        super(...relations)
        this.register()
    }

    // Instance Methods =======================================================
    public addRelations(...relations: RelationMetadata[]) {
        this.push(...relations)
        return this
    }

    // ------------------------------------------------------------------------

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

    // Protecteds -------------------------------------------------------------
    protected register() {
        Reflect.defineMetadata('relations', this, this.target)
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find(target: EntityTarget): RelationsMetadata | undefined {
        return Reflect.getOwnMetadata('relations', target)
    }

    // ------------------------------------------------------------------------

    public static build(
        target: EntityTarget,
        ...relations: RelationMetadata[]
    ) {
        return new RelationsMetadata(target, ...relations)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        target: EntityTarget,
        ...relations: RelationMetadata[]
    ) {
        return this.find(target)?.addRelations(...relations)
            ?? this.build(target, ...relations)
    }
}

export {
    RelationMetadata,
    type RelationMetadataType,

    type HasOneMetadata,
    type HasOneOptions,
    type HasOneRelatedGetter,

    type HasManyMetadata,
    type HasManyOptions,
    type HasManyRelatedGetter,

    type HasOneThroughMetadata,
    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    type HasManyThroughMetadata,
    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    type BelongsToMetadata,
    type BelongToOptions,
    type BelongsToRelatedGetter,

    type BelongsToThroughMetadata,
    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    type BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,

    type RelatedEntitiesMap
}