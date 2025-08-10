import 'reflect-metadata'

// Connection
import MySQLConnection from './Connection'

// Metadata
import { EntityMetadata, DataType } from './Metadata'

// Bases
import BaseEntity from './BaseEntity'
import BaseEntityUnion from './BaseEntityUnion'

// Symbols
import { Case, Exists } from './QueryBuilder'

// Decorators
import {
    Entity,
    EntityUnion,

    Column,
    Primary,
    ForeignKey,
    Unique,
    Nullable,
    Default,
    AutoIncrement,
    Unsigned,

    Id,
    ForeignId,
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
} from './Decorators'

export {
    MySQLConnection,

    EntityMetadata,
    DataType,

    BaseEntity,
    BaseEntityUnion,

    Entity,
    EntityUnion,

    Column,
    Primary,
    ForeignKey,
    Unique,
    Nullable,
    Default,
    AutoIncrement,
    Unsigned,

    Id,
    ForeignId,
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

    Case,
    Exists
}