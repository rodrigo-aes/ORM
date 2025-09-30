import Metadata from "../Metadata"

import EntityMetadata, {
    HooksMetadata,
    ScopesMetadata,
    ComputedPropertiesMetadata,
    CollectionsMetadata,
    PaginationsMetadata,

    type PolymorphicParentRelatedGetter,
} from "../EntityMetadata"

import PolymorphicColumnsMetadata, {
    PolymorphicColumnMetadata,

    type CombinedColumns,
    type CombinedColumnOptions
} from "./PolymorphicColumnsMetadata"

import PolymorphicRelationsMetadata from "./PolymorphicRelationsMetadata"

// Repository
import PolymorphicRepository from "../../PolymorphicRepository"

// Handlers
import MetadataHandler from '../MetadataHandler'
import { PolymorphicEntityBuilder } from "../../Handlers"
import { EntityToJSONProcessMetadata } from "../ProcessMetadata"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type { PolymorphicEntityTarget, EntityTarget } from "../../types"
import type {
    UnionEntitiesMap,
    SourcesMetadata,
    PolymorphicEntityMetadataJSON
} from "./types"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from '../../Errors'

export default class PolymorphicEntityMetadata extends Metadata {
    protected static override readonly KEY: string = (
        'polymorphic-entity-metadata'
    )
    protected static override readonly UNKNOWN_ERROR_CODE: MetadataErrorCode = (
        'UNKNOWN_ENTITY'
    )

    public target: PolymorphicEntityTarget
    public tableName: string

    private _entities!: UnionEntitiesMap
    private _sourcesMetadata!: SourcesMetadata

    private _columns?: PolymorphicColumnsMetadata
    private _relations?: PolymorphicRelationsMetadata

    public exclude?: string[] = []

    constructor(
        target: PolymorphicEntityTarget | undefined,
        tablename: string | undefined,
        public sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        if (!target && !tablename) throw new Error(
            'Polymorphic metadata needs a PolymorphicEntityTarget or tablename'
        )
        super()

        this.tableName = tablename ?? target!.name.toLocaleLowerCase()
        this.target = target ?? (
            PolymorphicEntityBuilder.buildInternalPolymorphicEntity(this)
        )

        this.loadEntities()
        this.loadSourcesMetadata()
        this.loadColumns()
        this.loadRelations()

        if (target) this.mergeCombined()

        // MetadataHandler.register(this, this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target.name ?? this.tableName
            .split('_')
            .map(word => (
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ))
            .join('')
    }

    // ------------------------------------------------------------------------

    public get connection(): PolyORMConnection {
        return MetadataHandler.getConnection(this.target)
    }

    // ------------------------------------------------------------------------

    public get entities(): UnionEntitiesMap {
        if (Object.values(this._entities ?? {}).length === 0) (
            this.loadEntities()
        )

        return this._entities
    }

    // ------------------------------------------------------------------------

    public get sourcesMetadata(): SourcesMetadata {
        if (Object.values(this._sourcesMetadata ?? {}).length === 0) (
            this.loadEntities()
        )

        return this._sourcesMetadata
    }

    // ------------------------------------------------------------------------

    public get columns(): PolymorphicColumnsMetadata {
        if (typeof this.sources === 'function') this.loadSourcesMetadata()
        return this._columns ?? this.loadColumns()
    }

    // ------------------------------------------------------------------------

    public get relations(): PolymorphicRelationsMetadata {
        return this._relations ?? this.loadRelations()
    }

    // ------------------------------------------------------------------------

    public get repository(): typeof PolymorphicRepository<any> {
        return MetadataHandler.getRepository(this.target)
            ?? PolymorphicRepository
    }

    // ------------------------------------------------------------------------

    public get hooks(): HooksMetadata | undefined {
        return HooksMetadata.find(this.target!)
    }

    // ------------------------------------------------------------------------

    public get scopes(): ScopesMetadata | undefined {
        return ScopesMetadata.find(this.target!)
    }

    // ------------------------------------------------------------------------

    public get combined(): CombinedColumns {
        return Reflect.getOwnMetadata('combined-columns', this.target!)
    }

    // ------------------------------------------------------------------------

    public get computedProperties(): ComputedPropertiesMetadata | undefined {
        return ComputedPropertiesMetadata.find(this.target!)
    }

    // ------------------------------------------------------------------------

    public get collections(): CollectionsMetadata | undefined {
        return CollectionsMetadata.find(this.target!)
    }

    // ------------------------------------------------------------------------

    public get paginations(): PaginationsMetadata | undefined {
        return PaginationsMetadata.find(this.target!)
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): PolymorphicColumnMetadata[] {
        return this.columns.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): PolymorphicColumnMetadata[] {
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
    public getRepository(): PolymorphicRepository<any> {
        return new this.repository(this.target)
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

    public defineRepository(repository: typeof PolymorphicRepository<any>): (
        void
    ) {
        return MetadataHandler.setRepository(repository, this.target)
    }

    // ------------------------------------------------------------------------

    public toJSON(): PolymorphicEntityMetadataJSON {
        return EntityToJSONProcessMetadata.initialized
            ? this.buildJSON()!
            : EntityToJSONProcessMetadata.apply(() => this.buildJSON())
    }

    // ------------------------------------------------------------------------

    public combineColumn(name: string, options: CombinedColumnOptions): void {
        this.combined[name] = options
    }

    // ------------------------------------------------------------------------

    public excludeColumns(...columnNames: string[]): void {
        this.exclude = columnNames
    }

    // Privates ---------------------------------------------------------------
    private loadEntities(): void {
        try {
            if (typeof this.sources === 'function') (
                this.sources = this.sources()
            )

            this._entities = Object.fromEntries(
                this.sources.map(source => [source.name, source])
            )

        } catch (error) {
            this._entities = {}
        }
    }

    // ------------------------------------------------------------------------

    private loadSourcesMetadata(): void {
        try {
            if (typeof this.sources === 'function') (
                this.sources = this.sources()
            )

            this._sourcesMetadata = Object.fromEntries(this.sources.map(
                source => [source.name, EntityMetadata.findOrBuild(source)]
            ))

        } catch (error) {
            this._sourcesMetadata = {}
        }
    }

    // ------------------------------------------------------------------------

    private loadColumns(): PolymorphicColumnsMetadata {
        const metas = Object.values(this.sourcesMetadata)

        this._columns = new PolymorphicColumnsMetadata(
            this.target,
            metas.flatMap(meta => meta.columns
                .filter(({ name }) => !this.exclude?.includes(name))
            )
        )

        return this._columns
    }

    // ------------------------------------------------------------------------

    private mergeCombined(): void {
        if (this.combined) this._columns!.combine(this.combined)
    }

    // ------------------------------------------------------------------------

    private loadRelations(): PolymorphicRelationsMetadata {
        const metas = Object.values(this.sourcesMetadata)
        const relations = metas.flatMap(meta => meta.relations)

        this._relations = new PolymorphicRelationsMetadata(
            this.target, ...relations
        )

        return this._relations
    }

    // ------------------------------------------------------------------------

    private buildJSON<T extends PolymorphicEntityTarget = any>(): (
        PolymorphicEntityMetadataJSON | undefined
    ) {
        if (EntityToJSONProcessMetadata.shouldAdd(this.name)) return {
            target: this.target as T,
            name: this.name,
            tableName: this.tableName,
            columns: this.columns.toJSON(),
            relations: this.relations?.toJSON(),
            repository: this.repository,
            hooks: this.hooks?.toJSON(),
            scopes: this.scopes?.toJSON(),
            computedProperties: this.computedProperties?.toJSON(),
            collections: this.collections?.toJSON(),
            paginations: this.paginations?.toJSON(),
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    // public static build(
    //     target: PolymorphicEntityTarget | undefined,
    //     tableName: string | undefined,
    //     sources: EntityTarget[] | PolymorphicParentRelatedGetter
    // ) {
    //     return new PolymorphicEntityMetadata(target, tableName, sources)
    // }

    // // ------------------------------------------------------------------------

    // public static find(target: PolymorphicEntityTarget | null): (
    //     PolymorphicEntityMetadata | undefined
    // ) {
    //     if (target) return Reflect.getOwnMetadata('union-metadata', target)
    // }

    // // ------------------------------------------------------------------------

    // public static findOrBuild(
    //     target: PolymorphicEntityTarget | undefined,
    //     tableName: string | undefined,
    //     sources: EntityTarget[] | PolymorphicParentRelatedGetter
    // ): PolymorphicEntityMetadata {
    //     return target
    //         ? this.find(target) ?? this.build(target, tableName, sources)
    //         : this.build(target, tableName, sources)
    // }

    // // ------------------------------------------------------------------------

    // public static findOrThrow(target: PolymorphicEntityTarget): (
    //     PolymorphicEntityMetadata
    // ) {
    //     return this.find(target)! ?? PolyORMException.Metadata.throw(
    //         "UNKNOWN_ENTITY", target.name
    //     )
    // }
}

export {
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,

    type UnionEntitiesMap,
    type CombinedColumnOptions
}