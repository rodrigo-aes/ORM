import 'reflect-metadata'

import type {
    EntityTarget,
    PolymorphicEntityTarget,
    Target,
    CollectionTarget
} from './types/General'

// Connection
import MySQLConnection from './Connection'

// CLI
import CLI, {
    MigrationCommander
} from './CLI'

// Metadata
import {
    DataType,

    type EntityMetadataJSON as EntityMetadata,
    type DataTypeMetadataJSON as DataTypeMetadata,
    type ColumnsMetadataJSON as ColumnsMetadata,
    type ColumnMetadataJSON as ColumnMetadata,
    type ForeignKeyReferencesJSON as ForeignKeyReferences,
    type RelationJSON as Relation,
    type RelationsMetadataJSON as RelationsMetadata,
    type JoinTableMetadataJSON as JoinTableMetadata,
    type HookMetadataJSON as HookMetadata,
    type HooksMetadataJSON as HooksMetadata,
    type ScopesMetadataJSON as ScopesMetadata,
    type ComputedPropertiesJSON as ComputedProperties,
    type CollectionsMetadataJSON as CollectionsMetadata,
} from './Metadata'

// Bases
import BaseEntity, { Collection, Pagination } from './BaseEntity'
import BasePolymorphicEntity from './BasePolymorphicEntity'

// Repositories
import Repository from './Repository'
import PolymorphicRepository from './PolymorphicRepository'

// Query Builders
import {
    EntityQueryBuilder,
    PolymorphicEntityQueryBuilder,
    ConnectionQueryBuilder,

    FindOneQueryBuilder,
    FindQueryBuilder,
    BulkInsertQueryBuilder,
    InsertQueryBuilder,
    UpdateQueryBuilder,
    UpdateOrCreateQueryBuilder,
    DeleteQueryBuilder,

    type SelectQueryBuilder,
    type CountQueryBuilder,
    type AndQueryBuilder,
    type CaseQueryBuilder,
    type ConditionalQueryHandler,
    type JoinQueryBuilder,

    type SelectQueryHandler,
    type CountQueryHandler,
    type AndQueryHandler,
    type CaseQueryHandler,
    type WhereQueryHandler,
    type JoinQueryHandler,
    type PaginateQueryBuilder
} from './QueryBuilder'

// Relations
import type {
    HasOne as HasOneHandler,
    HasMany as HasManyHandler,
    BelongsTo as BelongsToHandler,
    HasOneThrough as HasOneThroughHandler,
    HasManyThrough as HasManyThroughHandler,
    BelongsToThrough as BelongsToThroughHandler,
    BelongsToMany as BelongsToManyHandler,
    PolymorphicHasOne as PolymorphicHasOneHandler,
    PolymorphicHasMany as PolymorphicHasManyHandler,
    PolymorphicBelongsTo as PolymorphicBelongsToHandler
} from './Relations'

// Trigger
import {
    Trigger,

    type TriggerTiming,
    type TriggerEvent,
    type TriggerOrientation,
    type TriggerActionType,
    type TriggerAction,
    type InsertIntoTableAction,
    type UpdateTableAction,
    type DeleteFromAction,
} from './Triggers'

// Decorators
import {
    Entity,
    PolymorphicEntity,

    Column,
    ComputedColumn,
    Primary,
    ForeignKey,
    Unique,
    Nullable,
    Default,
    AutoIncrement,
    Unsigned,

    Id,
    PolymorphicId,
    ForeignId,
    PolymorphicForeignId,
    CreatedTimestamp,
    UpdatedTimestamp,

    HasOne,
    HasMany,
    HasOneThrough,
    HasManyThrough,
    BelongsTo,
    BelongsToThrough,
    BelongsToMany,

    PolymorphicHasOne,
    PolymorphicHasMany,
    PolymorphicBelongsTo,

    BeforeSync,
    AfterSync,
    BeforeFind,
    AfterFind,
    BeforeBulkFind,
    AfterBulkFind,
    BeforeCreate,
    AfterCreate,
    BeforeBulkCreate,
    AfterBulkCreate,
    BeforeUpdate,
    AfterUpdate,
    BeforeBulkUpdate,
    AfterBulkUpdate,
    BeforeDelete,
    AfterDelete,
    BeforeBulkDelete,
    AfterBulkDelete,

    UseRepository,
    ComputedProperty,
    Scopes,
    DefaultScope,
    Triggers,
    Collections,
    DefaultCollection,
    Paginations,
    DefaultPagination,

    type ForeignKeyReferencedGetter,
    type ForeignKeyConstraintOptions,
    type ForeignIdRelatedGetter,
    type ForeignIdOptions,
    type PolymorphicForeignIdRelatedGetter,
    type PolymorphicForeignIdOptions,
    type PolymorphicTypeKeyRelateds,

    type CombinedColumnOptions,
    type ComputedPropertyFunction,

    type HasOneOptions,
    type HasOneRelatedGetter,

    type HasManyOptions,
    type HasManyRelatedGetter,

    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    type BelongToOptions,
    type BelongsToRelatedGetter,

    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicHasOneOptions,
    type PolymorphicHasManyOptions,
    type PolymorphicBelongsToOptions
} from './Decorators'

import { Migration } from './Migrator'

import type DatabaseSchema from './DatabaseSchema'
import type {
    TableSchema,
    ColumnSchema,
} from './DatabaseSchema'

import {
    Procedure,

    Op,
    Case,
    Exists,
    Cross,
    CurrentTimestamp,

    type EntityProperties,
    type EntityRelations,
    type EntityPropertiesKeys,
    type EntityRelationsKeys,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions,
    type CreationAttributes,
    type CreationAttributesOptions,
    type CreationAttibutesKey,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type SelectOptions,
    type SelectPropertyOptions,
    type SelectPropertyKey,
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,
    type RelationsOptions,
    type RelationOptions,
    type GroupQueryOptions,
    type OrderQueryOptions,
    type OrderQueryOption,

    type RelationHandlerSQLBuilder,
    type OneRelationHandlerSQLBuilder,
    type ManyRelationHandlerSQLBuilder,

    type CompatibleOperators,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
    type ExistsQueryOptions,
    type CrossExistsQueryOptions,
} from './SQLBuilders'

export {
    MySQLConnection,

    CLI,
    MigrationCommander,

    DataType,

    BaseEntity,
    BasePolymorphicEntity,
    Collection,
    Pagination,

    Repository,
    PolymorphicRepository,

    EntityQueryBuilder,
    PolymorphicEntityQueryBuilder,
    ConnectionQueryBuilder,

    FindOneQueryBuilder,
    FindQueryBuilder,
    BulkInsertQueryBuilder,
    InsertQueryBuilder,
    UpdateQueryBuilder,
    UpdateOrCreateQueryBuilder,
    DeleteQueryBuilder,

    Trigger,
    Procedure,

    Migration,

    Entity,
    PolymorphicEntity,

    Column,
    ComputedColumn,
    Primary,
    ForeignKey,
    Unique,
    Nullable,
    Default,
    AutoIncrement,
    Unsigned,

    Id,
    PolymorphicId,
    ForeignId,
    PolymorphicForeignId,
    CreatedTimestamp,
    UpdatedTimestamp,

    HasOne,
    HasMany,
    HasOneThrough,
    HasManyThrough,
    BelongsTo,
    BelongsToThrough,
    BelongsToMany,

    PolymorphicHasOne,
    PolymorphicHasMany,
    PolymorphicBelongsTo,

    BeforeSync,
    AfterSync,
    BeforeFind,
    AfterFind,
    BeforeBulkFind,
    AfterBulkFind,
    BeforeCreate,
    AfterCreate,
    BeforeBulkCreate,
    AfterBulkCreate,
    BeforeUpdate,
    AfterUpdate,
    BeforeBulkUpdate,
    AfterBulkUpdate,
    BeforeDelete,
    AfterDelete,
    BeforeBulkDelete,
    AfterBulkDelete,

    UseRepository,
    ComputedProperty,
    Scopes,
    DefaultScope,
    Triggers,
    Collections,
    DefaultCollection,
    Paginations,
    DefaultPagination,

    Op,
    Case,
    Exists,
    Cross,
    CurrentTimestamp,

    type EntityTarget,
    type PolymorphicEntityTarget,
    type Target,
    type CollectionTarget,

    type EntityMetadata,
    type DataTypeMetadata,
    type ColumnsMetadata,
    type ColumnMetadata,
    type ForeignKeyReferences,
    type Relation,
    type RelationsMetadata,
    type JoinTableMetadata,
    type HookMetadata,
    type HooksMetadata,
    type ScopesMetadata,
    type ComputedProperties,
    type CollectionsMetadata,

    type DatabaseSchema,
    type TableSchema,
    type ColumnSchema,

    type ForeignKeyReferencedGetter,
    type ForeignKeyConstraintOptions,
    type ForeignIdRelatedGetter,
    type ForeignIdOptions,
    type PolymorphicForeignIdRelatedGetter,
    type PolymorphicForeignIdOptions,
    type PolymorphicTypeKeyRelateds,

    type CombinedColumnOptions,
    type ComputedPropertyFunction,

    type HasOneHandler,
    type HasManyHandler,
    type BelongsToHandler,
    type HasOneThroughHandler,
    type HasManyThroughHandler,
    type BelongsToThroughHandler,
    type BelongsToManyHandler,
    type PolymorphicHasOneHandler,
    type PolymorphicHasManyHandler,
    type PolymorphicBelongsToHandler,

    type HasOneOptions,
    type HasOneRelatedGetter,

    type HasManyOptions,
    type HasManyRelatedGetter,

    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    type BelongToOptions,
    type BelongsToRelatedGetter,

    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicHasOneOptions,
    type PolymorphicHasManyOptions,
    type PolymorphicBelongsToOptions,

    type SelectQueryBuilder,
    type CountQueryBuilder,
    type AndQueryBuilder,
    type CaseQueryBuilder,
    type ConditionalQueryHandler,
    type JoinQueryBuilder,

    type SelectQueryHandler,
    type CountQueryHandler,
    type AndQueryHandler,
    type CaseQueryHandler,
    type WhereQueryHandler,
    type JoinQueryHandler,
    type PaginateQueryBuilder,

    type TriggerTiming,
    type TriggerEvent,
    type TriggerOrientation,
    type TriggerActionType,
    type TriggerAction,
    type InsertIntoTableAction,
    type UpdateTableAction,
    type DeleteFromAction,

    type EntityProperties,
    type EntityRelations,
    type EntityPropertiesKeys,
    type EntityRelationsKeys,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions,
    type CreationAttributes,
    type CreationAttributesOptions,
    type CreationAttibutesKey,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type SelectOptions,
    type SelectPropertyOptions,
    type SelectPropertyKey,
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,
    type RelationsOptions,
    type RelationOptions,
    type GroupQueryOptions,
    type OrderQueryOptions,
    type OrderQueryOption,

    type RelationHandlerSQLBuilder,
    type OneRelationHandlerSQLBuilder,
    type ManyRelationHandlerSQLBuilder,

    type CompatibleOperators,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
    type ExistsQueryOptions,
    type CrossExistsQueryOptions,
}