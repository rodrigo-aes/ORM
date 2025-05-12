import 'reflect-metadata'

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
} from './ColumnsMetadata'

// Relations Metadata
import RelationsMetadata, {
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

    type BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter
} from './RelationsMetadata'

// Join Table Metadata
import JoinTableMetadata, {
    JoinColumnsMetadata,
    JoinColumnMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
} from './JoinTableMetadata'

// Hooks
import HooksMetadata from './HooksMetadata'

// Types
import type { EntityTarget } from '../../../types/General'
import type { EntityMetadataInitMap } from './types'
import type {

} from './RelationsMetadata'

export default class EntityMetadata {
    public tableName!: string
    public columns!: ColumnsMetadata
    public relations?: RelationsMetadata
    public joinTables?: JoinTableMetadata[]
    public hooks?: HooksMetadata

    constructor(
        public target: EntityTarget,
        initMap?: EntityMetadataInitMap
    ) {
        this.fill(initMap)
        this.loadColumns()
        this.loadRelations()
        this.loadJoinTables()
        this.loadHooks()
        this.register()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
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

    private loadColumns() {
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
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,
    HooksMetadata,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

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

    type BelongsToManyMetadata,
    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,

    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,

    type ForeignIdConfig,
}