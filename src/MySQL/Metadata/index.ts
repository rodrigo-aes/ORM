import EntityMetadata, {
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    RelationMetadata,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,
    HooksMetadata,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

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

    type ForeignIdConfig,
} from "./EntityMetadata"

import MetadataHandler from "./MetadataHandler"

export {
    EntityMetadata,
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    RelationMetadata,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,
    MetadataHandler,
    HooksMetadata,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

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

    type ForeignIdConfig,
}