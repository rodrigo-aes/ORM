import 'reflect-metadata'

// Connection
import MySQLConnection from './Connection'

// Metadata
import { EntityMetadata, DataType } from './Metadata'

// Bases
import BaseEntity from './BaseEntity'
import BasePolymorphicEntity from './BasePolymorphicEntity'

// Symbols
import { Case, Exists, Cross } from './SQLBuilders'

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

    Repository,
    ComputedProperty,
    Scopes,
    DefaultScope,
    Triggers,
    Collections,
    DefaultCollection,
    Paginations,
    DefaultPagination,
} from './Decorators'

import { Migration } from './Migrator'

export {
    MySQLConnection,

    EntityMetadata,
    DataType,

    BaseEntity,
    BasePolymorphicEntity,

    Trigger,
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

    Repository,
    ComputedProperty,
    Scopes,
    DefaultScope,
    Triggers,
    Collections,
    DefaultCollection,
    Paginations,
    DefaultPagination,

    Case,
    Exists,
    Cross,

    type TriggerTiming,
    type TriggerEvent,
    type TriggerOrientation,
    type TriggerActionType,
    type TriggerAction,
    type InsertIntoTableAction,
    type UpdateTableAction,
    type DeleteFromAction,
}