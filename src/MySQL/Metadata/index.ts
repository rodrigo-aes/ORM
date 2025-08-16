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
    ScopesMetadata,
    ScopeMetadataHandler,
    TriggersMetadata,
    CollectionsMetadata,
    CollectionsMetadataHandler,
    ComputedPropertiesMetadata,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

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

    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,

    type Scope,
    type ScopeFunction,

    type ComputedType,
    type ComputedPropertyFunction
} from "./EntityMetadata"

import EntityUnionMetadata, {
    UnionColumnsMetadata,
    UnionColumnMetadata,

    type UnionEntitiesMap,
    type CombinedColumnOptions
} from "./EntityUnionMetadata"

import MetadataHandler from "./MetadataHandler"
import TempMetadata from "./TempMetadata"

export {
    EntityMetadata,
    EntityUnionMetadata,
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    UnionColumnsMetadata,
    UnionColumnMetadata,
    RelationMetadata,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,
    HooksMetadata,
    ScopesMetadata,
    TriggersMetadata,
    CollectionsMetadata,
    ComputedPropertiesMetadata,

    TempMetadata,
    MetadataHandler,
    ScopeMetadataHandler,
    CollectionsMetadataHandler,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

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

    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,

    type Scope,
    type ScopeFunction,

    type UnionEntitiesMap,
    type CombinedColumnOptions,

    type ComputedType,
    type ComputedPropertyFunction
}