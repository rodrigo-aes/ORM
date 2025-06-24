import 'reflect-metadata'

// Connection
import MySQLConnection from './Connection'

// Metadata
import { EntityMetadata, DataType } from './Metadata'

// Bases
import BaseEntity from './BaseEntity'
import BaseEntityUnion from './BaseEntityUnion'

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
}