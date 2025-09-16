import 'reflect-metadata'

import type MySQLConnection from '../../Connection'

// Handlers
import MetadataHandler from '../MetadataHandler'

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

    type ColumnConfig,
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

// Join Table Metadata
import JoinTableMetadata, {
    JoinColumnsMetadata,
    JoinColumnMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTableMetadataJSON
} from './JoinTableMetadata'

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

import ComputedPropertiesMetadata, {
    type ComputedPropertyFunction,
    type ComputedPropertiesJSON
} from './ComputedPropertiesMetadata'

import TriggersMetadata from './TriggersMetadata'

import CollectionsMetadata, {
    CollectionsMetadataHandler,
    type CollectionsMetadataJSON
} from './CollectionsMetadata'

import PaginationsMetadata, {
    PaginationMetadataHandler
} from './PaginationsMetadata'

import { EntityToJSONProcessMetadata } from '../ProcessMetadata'

// Types
import type { EntityTarget } from '../../types/General'
import type { EntityMetadataInitMap, EntityMetadataJSON } from './types'

export default class EntityMetadata {
    public connection?: MySQLConnection

    public tableName!: string

    public columns: ColumnsMetadata = ColumnsMetadata.findOrBuild(this.target)

    public relations?: RelationsMetadata = RelationsMetadata.find(this.target)

    public joinTables?: JoinTableMetadata[]

    public repository!: typeof Repository<any>

    public hooks?: HooksMetadata = HooksMetadata.find(this.target)

    public scopes?: ScopesMetadata = ScopesMetadata.find(this.target)

    public computedProperties?: ComputedPropertiesMetadata = (
        ComputedPropertiesMetadata.find(this.target)
    )

    public triggers: TriggersMetadata = TriggersMetadata.findOrBuild(
        this.target
    )

    public collections?: CollectionsMetadata = CollectionsMetadata.find(
        this.target
    )

    public paginations?: PaginationsMetadata = PaginationsMetadata.find(
        this.target
    )

    constructor(
        public target: EntityTarget,
        initMap?: EntityMetadataInitMap
    ) {
        this.fill(initMap)
        this.loadJoinTables()
        this.loadRepository()
        this.register()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): ColumnMetadata[] {
        return [...this.columns].filter(({ isForeignKey }) => isForeignKey)
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
    public defineConnection(connection: MySQLConnection) {
        this.connection = connection
    }

    // ------------------------------------------------------------------------

    public getConnection(): MySQLConnection {
        return Reflect.getOwnMetadata('temp-connection', this.target)
            ?? this.connection
    }

    // ------------------------------------------------------------------------

    public defineRepository(repository: typeof Repository<any>): void {
        this.repository = repository
    }

    // ------------------------------------------------------------------------

    public getRepository(): Repository<any> {
        return new this.repository(this.target)
    }

    // ------------------------------------------------------------------------

    public registerColumn(name: string, dataType: DataType) {
        this.columns.registerColumn(name, dataType)
    }

    // ------------------------------------------------------------------------

    public registerColumnPattern(name: string, pattern: ColumnPattern) {
        this.columns.registerColumnPattern(name, pattern)
    }

    // ------------------------------------------------------------------------

    public getColumn(name: string): ColumnMetadata {
        return this.columns.getColumn(name)
    }

    // ------------------------------------------------------------------------

    public setColumn(name: string, config: ColumnConfig) {
        return this.columns.setColumn(name, config)
    }

    // ------------------------------------------------------------------------

    public addDependency(entity: EntityTarget) {
        this.dependencies.push(entity)
    }

    // ------------------------------------------------------------------------

    public addJoinTable(
        relateds: JoinTableRelatedsGetter,
        name?: string
    ) {
        const joinTable = new JoinTableMetadata(relateds, name)

        if (!this.joinTables) this.joinTables = []
        this.joinTables.push(joinTable)

        return joinTable
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends EntityTarget = any>(): (
        EntityMetadataJSON<T> | undefined
    ) {
        return EntityToJSONProcessMetadata.initialized
            ? this.buildJSON()
            : EntityToJSONProcessMetadata.apply(
                () => this.buildJSON()
            )
    }

    // Protecteds -------------------------------------------------------------
    protected register() {
        Reflect.defineMetadata('entity-metadata', this, this.target)
    }

    // Privates ---------------------------------------------------------------
    private fill(initMap?: EntityMetadataInitMap): this {
        Object.assign(this, initMap)
        return this
    }

    // ------------------------------------------------------------------------

    private loadJoinTables() {
        this.joinTables = Reflect.getOwnMetadata('join-tables', this.target)
    }

    // ------------------------------------------------------------------------

    private loadRepository() {
        this.repository = Reflect.getOwnMetadata(
            'repository', this.target
        )
            ?? Repository
    }

    // ------------------------------------------------------------------------

    private buildJSON<T extends EntityTarget = any>(): (
        EntityMetadataJSON | undefined
    ) {
        if (EntityToJSONProcessMetadata.shouldAdd(this.name)) return {
            target: this.target as T,
            name: this.name,
            tableName: this.tableName,
            columns: this.columns.toJSON(),
            relations: this.relations?.toJSON(),
            joinTables: this.joinTables?.map(table => table.toJSON()),
            repository: this.repository,
            hooks: this.hooks?.toJSON(),
            scopes: this.scopes?.toJSON(),
            computedProperties: this.computedProperties?.toJSON(),
            triggers: [...this.triggers ?? []],
            collections: this.collections?.toJSON(),
            paginations: this.paginations?.toJSON(),
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static find(target: EntityTarget): EntityMetadata | undefined {
        return Reflect.getOwnMetadata('entity-metadata', target)
    }

    // ------------------------------------------------------------------------

    public static build(
        target: EntityTarget,
        initMap?: EntityMetadataInitMap
    ) {
        return new EntityMetadata(target, initMap)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        target: EntityTarget,
        initMap?: EntityMetadataInitMap
    ): EntityMetadata {
        return this.find(target)?.fill(initMap) ?? this.build(target, initMap)
    }

    // ------------------------------------------------------------------------

    public static findColumn(
        target: EntityTarget,
        name: string
    ): ColumnMetadata | undefined {
        return this.find(target)?.columns.findColumn(name)
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