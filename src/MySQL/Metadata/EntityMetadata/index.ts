import 'reflect-metadata'

import type MySQLConnection from '../../Connection'

// Objects
// Data Type
import DataType from './DataType'

// Columns Metadata
import ColumnsMetadata, {
    ColumnMetadata,

    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
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
    type RelationsMetadataJSON,

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
} from './RelationsMetadata'

// Join Table Metadata
import JoinTableMetadata, {
    JoinColumnsMetadata,
    JoinColumnMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
} from './JoinTableMetadata'

import Repository from '../../Repository'

// Hooks
import HooksMetadata from './HooksMetadata'

import { EntityToJSONProcessMetadata } from '../ProcessMetadata'

// Types
import type { EntityTarget } from '../../../types/General'
import type { EntityMetadataInitMap, EntityMetadataJSON } from './types'

export default class EntityMetadata {
    public connection?: MySQLConnection

    public tableName!: string
    public columns!: ColumnsMetadata
    public relations?: RelationsMetadata
    public joinTables?: JoinTableMetadata[]
    public hooks?: HooksMetadata
    public repository!: Repository<any>

    constructor(
        public target: EntityTarget,
        initMap?: EntityMetadataInitMap
    ) {
        this.fill(initMap)
        this.loadColumns()
        this.loadRelations()
        this.loadJoinTables()
        this.loadHooks()
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
    public defineConnection(connection: MySQLConnection) {
        this.connection = connection
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

    protected loadColumns() {
        this.columns = ColumnsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private loadRelations() {
        this.relations = RelationsMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    private loadJoinTables() {
        this.joinTables = Reflect.getOwnMetadata('join-tables', this.target)
    }

    // ------------------------------------------------------------------------

    private loadHooks() {
        this.hooks = HooksMetadata.find(this.target)
    }

    // ------------------------------------------------------------------------

    private loadRepository() {
        const repo: typeof Repository<any> = Reflect.getOwnMetadata(
            'repository', this.target
        )
            ?? Repository

        this.repository = new repo(this.target)
    }

    // ------------------------------------------------------------------------

    private buildJSON<T extends EntityTarget = any>(): (
        EntityMetadataJSON | undefined
    ) {
        return EntityToJSONProcessMetadata.shouldAdd(this.name)
            ? {
                target: this.target as T,
                name: this.name,
                tableName: this.tableName,
                columns: this.columns.toJSON(),
                relations: this.relations?.toJSON(),
                joinTables: this.joinTables?.map(table => table.toJSON())
            }
            : undefined
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

    // ------------------------------------------------------------------------

    public static defineRepository(
        target: EntityTarget,
        repository: typeof Repository<any>
    ): void {
        Reflect.defineMetadata('repository', repository, target)
    }
}

export {
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    RelationMetadata,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

    type RelationMetadataType,
    type RelationsMetadataJSON,

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

    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
}