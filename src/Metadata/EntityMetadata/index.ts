import Metadata from '../Metadata'

// Objects
// Data Type
import DataType, {
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

    type DataTypeMetadataJSON,
    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType
} from './DataType'

// Columns Metadata
import ColumnsMetadata, {
    ColumnMetadata,

    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
} from './ColumnsMetadata'

// Relations Metadata
import RelationsMetadata, {
    RelationMetadata,
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

    type RelationJSON,
    type RelationsMetadataJSON,
} from './RelationsMetadata'

// JoinTables Metadata
import JoinTablesMetadata, {
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTableMetadataJSON
} from './JoinTablesMetadata'

import Repository from '../../Repository'

// Hooks
import HooksMetadata, {
    type HookMetadataJSON,
    type HooksMetadataJSON
} from './HooksMetadata'

// Scopes
import ScopesMetadata, {
    ScopeMetadata,
    ScopeMetadataHandler,

    type Scope,
    type ScopeFunction,
    type ScopesMetadataJSON
} from './ScopesMetadata'

// Computed Properties
import ComputedPropertiesMetadata, {
    type ComputedPropertyFunction,
    type ComputedPropertiesJSON
} from './ComputedPropertiesMetadata'

// Triggers
import TriggersMetadata from './TriggersMetadata'

// Collections
import CollectionsMetadata, {
    CollectionsMetadataHandler,
    type CollectionsMetadataJSON
} from './CollectionsMetadata'

// Pagintions
import PaginationsMetadata, {
    PaginationMetadataHandler
} from './PaginationsMetadata'

// Processes
import { EntityToJSONProcessMetadata } from '../ProcessMetadata'

// Handlers
import MetadataHandler from '../MetadataHandler'

// Types
import type { EntityTarget } from '../../types'
import type { EntityMetadataJSON } from './types'
import type { PolyORMConnection } from '../ConnectionsMetadata'

// Exceptions
import { type MetadataErrorCode } from '../../Errors'

export default class EntityMetadata extends Metadata {
    protected static override readonly KEY: string = 'entity-metadata'
    protected static override readonly UNKNOWN_ERROR_CODE: MetadataErrorCode = (
        'UNKNOWN_ENTITY'
    )

    constructor(
        public target: EntityTarget,
        public tableName: string = target.name.toLowerCase()
    ) {
        super()
        MetadataHandler.register(this, target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get connection(): PolyORMConnection {
        return MetadataHandler.getConnection(this.target)
    }

    // ------------------------------------------------------------------------

    public get Repository(): typeof Repository<any> {
        return MetadataHandler.getRepository(this.target) ?? Repository
    }

    // ------------------------------------------------------------------------

    public get columns(): ColumnsMetadata {
        return ColumnsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get relations(): RelationsMetadata {
        return RelationsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get joinTables(): JoinTablesMetadata {
        return JoinTablesMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get hooks(): HooksMetadata | undefined {
        return HooksMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    public get scopes(): ScopesMetadata | undefined {
        return ScopesMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    public get computedProperties(): ComputedPropertiesMetadata | undefined {
        return ComputedPropertiesMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    public get triggers(): TriggersMetadata | undefined {
        return TriggersMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    public get collections(): CollectionsMetadata | undefined {
        return CollectionsMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    public get paginations(): PaginationsMetadata | undefined {
        return PaginationsMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): ColumnMetadata[] {
        return this.columns.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): ColumnMetadata[] {
        return this.foreignKeys.filter(
            ({ references }) => references?.constrained
        )
    }

    // ------------------------------------------------------------------------

    public get dependencies(): EntityTarget[] {
        return this.constrainedForeignKeys.flatMap(
            ({ references }) => references!.referenced()
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getRepository(): Repository<any> {
        return new this.Repository(this.target)
    }

    // ------------------------------------------------------------------------

    public defineDefaultConnection(connection: PolyORMConnection | string) {
        return MetadataHandler.setDefaultConnection(connection, this.target)
    }

    // ------------------------------------------------------------------------

    public defineTempConnection(connection: PolyORMConnection | string): void {
        return MetadataHandler.setTempConnection(connection, this.target)
    }

    // ------------------------------------------------------------------------

    public defineRepository(repository: typeof Repository<any>): void {
        return MetadataHandler.setRepository(repository, this.target)
    }

    // ------------------------------------------------------------------------

    public addJoinTable(
        relateds: JoinTableRelatedsGetter,
        name?: string
    ) {
        const joinTable = new JoinTableMetadata(relateds, name)
        this.joinTables.push(joinTable)

        return joinTable
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends EntityTarget = any>(): EntityMetadataJSON<T> {
        return EntityToJSONProcessMetadata.initialized
            ? this.buildJSON()!
            : EntityToJSONProcessMetadata.apply(() => this.buildJSON()!)
    }

    // Privates ---------------------------------------------------------------
    private buildJSON<T extends EntityTarget = any>(): (
        EntityMetadataJSON | undefined
    ) {
        if (EntityToJSONProcessMetadata.shouldAdd(this.name)) return {
            target: this.target as T,
            name: this.name,
            tableName: this.tableName,
            repository: this.Repository,
            columns: this.columns.toJSON(),
            relations: this.relations?.toJSON(),
            joinTables: this.joinTables?.map(table => table.toJSON()),
            hooks: this.hooks?.toJSON(),
            scopes: this.scopes?.toJSON(),
            computedProperties: this.computedProperties?.toJSON(),
            triggers: this.triggers?.toJSON(),
            collections: this.collections?.toJSON(),
            paginations: this.paginations?.toJSON(),
        }
    }
}

export {
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
    JoinTablesMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    // Hooks
    HooksMetadata,

    // Scopes
    ScopesMetadata,
    ScopeMetadata,
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
}