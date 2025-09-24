import 'reflect-metadata'

import ConnectionsMetadata, {
    type PolyORMConnection
} from '../ConnectionsMetadata'

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

// Types
import type { EntityTarget } from '../../types/General'
import type { EntityMetadataInitMap, EntityMetadataJSON } from './types'

// Exceptions
import PolyORMException from '../../Errors'

export default class EntityMetadata {
    public tableName!: string

    constructor(
        public target: EntityTarget,
        initMap?: EntityMetadataInitMap
    ) {
        this.fill(initMap)
        this.register()

        if (!this.joinTables) Reflect.defineMetadata(
            'join-tables',
            [],
            this.target
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get connection(): PolyORMConnection {
        return Reflect.getOwnMetadata('temp-connection', this.target)
            ?? Reflect.getOwnMetadata('default-connection', this.target)!
            ?? PolyORMException.Metadata.throw(
                'MISSING_ENTITY_CONNECTION', this.name
            )
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

    public get joinTables(): JoinTableMetadata[] {
        return Reflect.getOwnMetadata('join-tables', this.target)
    }

    // ------------------------------------------------------------------------

    public get repository(): typeof Repository<any> {
        return Reflect.getOwnMetadata('repository', this.target) ?? Repository
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

    public get triggers(): TriggersMetadata {
        return TriggersMetadata.findOrBuild(this.target)
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
    public defineDefaultConnection(connection: PolyORMConnection | string) {
        if (!Reflect.getOwnMetadata('default-connection', this.target)) (
            Reflect.defineMetadata(
                'default-connection',
                this.resolveConnection(connection),
                this.target
            )
        )
    }

    // ------------------------------------------------------------------------

    public defineTempConnection(connection: PolyORMConnection | string): void {
        Reflect.defineMetadata(
            'temp-connection',
            this.resolveConnection(connection),
            this.target
        )
    }

    // ------------------------------------------------------------------------

    public defineRepository(repository: typeof Repository<any>): void {
        Reflect.defineMetadata('repository', repository, this.target)
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

    private resolveConnection(connection: PolyORMConnection | string): (
        PolyORMConnection
    ) {
        switch (typeof connection) {
            case 'object': return connection
            case 'string': return ConnectionsMetadata.findOrThrow(connection)
        }
    }

    // ------------------------------------------------------------------------

    private buildJSON<T extends EntityTarget = any>(): (
        EntityMetadataJSON | undefined
    ) {
        if (EntityToJSONProcessMetadata.shouldAdd(this.name)) return {
            target: this.target as T,
            name: this.name,
            tableName: this.tableName,
            repository: this.repository,
            columns: this.columns.toJSON(),
            relations: this.relations?.toJSON(),
            joinTables: this.joinTables?.map(table => table.toJSON()),
            hooks: this.hooks?.toJSON(),
            scopes: this.scopes?.toJSON(),
            computedProperties: this.computedProperties?.toJSON(),
            triggers: this.triggers.toJSON(),
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

    public static findOrThrow(target: EntityTarget): EntityMetadata {
        return this.find(target)! ?? PolyORMException.Metadata.throw(
            'UNKNOWN_ENTITY', target.name
        )
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