import ConnectionsMetadata from "./ConnectionsMetadata"

import EntityMetadata, {
    // Columns
    ColumnsMetadata,
    ColumnMetadata,
    type ColumnPattern,

    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType,

    // Relations
    RelationMetadata,
    RelationsMetadata,

    // Join Tables
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    // Hooks
    HooksMetadata,

    // Scopes
    ScopesMetadata,
    ScopeMetadataHandler,

    // Triggers
    TriggersMetadata,

    // Computed Properties
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction,

    // Collections
    CollectionsMetadata,
    CollectionsMetadataHandler,

    // Paginations
    PaginationsMetadata,
    PaginationMetadataHandler,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

    // Relations
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

    // Scopes
    type Scope,
    type ScopeFunction,

    // JSON Types
    type EntityMetadataJSON,
    type DataTypeMetadataJSON,
    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON,
    type RelationJSON,
    type RelationsMetadataJSON,
    type JoinTableMetadataJSON,
    type HookMetadataJSON,
    type HooksMetadataJSON,
    type ScopesMetadataJSON,
    type ComputedPropertiesJSON,
    type CollectionsMetadataJSON,

    // Data Type
    DataType,
    CHAR,
    VARCHAR,
    TEXT,
    INT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    BOOLEAN,
    ENUM,
    SET,
    TIMESTAMP,
    DATETIME,
    DATE,
    TIME,
    YEAR,
    JSON,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,
} from "./EntityMetadata"

import PolymorphicEntityMetadata, {
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,

    type UnionEntitiesMap,
    type CombinedColumnOptions
} from "./PolymorphicEntityMetadata"

import MetadataHandler from "./MetadataHandler"
import TempMetadata from "./TempMetadata"

export {
    ConnectionsMetadata,

    EntityMetadata,
    PolymorphicEntityMetadata,
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,
    RelationMetadata,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,
    HooksMetadata,
    ScopesMetadata,
    TriggersMetadata,
    CollectionsMetadata,
    PaginationsMetadata,
    ComputedPropertiesMetadata,

    TempMetadata,
    MetadataHandler,
    ScopeMetadataHandler,
    CollectionsMetadataHandler,
    PaginationMetadataHandler,

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
    type PolymorphicTypeKeyRelateds,

    type Scope,
    type ScopeFunction,

    type ColumnPattern,

    type UnionEntitiesMap,
    type CombinedColumnOptions,

    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType,
    type ComputedPropertyFunction,

    type EntityMetadataJSON,
    type DataTypeMetadataJSON,
    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON,
    type RelationJSON,
    type RelationsMetadataJSON,
    type JoinTableMetadataJSON,
    type HookMetadataJSON,
    type HooksMetadataJSON,
    type ScopesMetadataJSON,
    type ComputedPropertiesJSON,
    type CollectionsMetadataJSON,

    CHAR,
    VARCHAR,
    TEXT,
    INT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    BOOLEAN,
    ENUM,
    SET,
    TIMESTAMP,
    DATETIME,
    DATE,
    TIME,
    YEAR,
    JSON,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,
}