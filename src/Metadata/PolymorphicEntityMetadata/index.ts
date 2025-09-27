import ConnectionsMetadata from "../ConnectionsMetadata"

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
import { PolymorphicEntityBuilder } from "../../Handlers"
import { EntityToJSONProcessMetadata } from "../ProcessMetadata"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type { PolymorphicEntityTarget, EntityTarget } from "../../types/General"
import type {
    UnionEntitiesMap,
    SourcesMetadata,
    PolymorphicEntityMetadataJSON
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class PolymorphicEntityMetadata {
    public target: PolymorphicEntityTarget

    private _entities!: UnionEntitiesMap
    private _sourcesMetadata!: SourcesMetadata

    private _columns?: PolymorphicColumnsMetadata
    private _relations?: PolymorphicRelationsMetadata

    public exclude?: string[] = []

    constructor(
        public tableName: string,
        target: PolymorphicEntityTarget | null,
        public sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        this.loadEntities()
        this.loadSourcesMetadata()
        this.loadColumns()
        this.loadRelations()

        this.target = target
            ?? PolymorphicEntityBuilder.buildInternalEntityUnion(this)

        if (this.target) this.mergeCombined()

        this.register()
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

    public get targetName(): string {
        return this.target?.name ?? this.tableName
            .split('_')
            .map(word => (
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ))
            .join('')
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
        return Reflect.getOwnMetadata('repository', this.target!)
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

    public defineRepository(repository: typeof PolymorphicRepository<any>): (
        void
    ) {
        Reflect.defineMetadata('repository', repository, this.target!)
    }

    // ------------------------------------------------------------------------

    public getRepository(): PolymorphicRepository<any> {
        return new this.repository(this.target)
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
    private register(): void {
        Reflect.defineMetadata('union-metadata', this, this.target)
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
    public static build(
        name: string,
        target: PolymorphicEntityTarget | null,
        sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        return new PolymorphicEntityMetadata(
            name,
            target,
            sources
        )
    }

    // ------------------------------------------------------------------------

    public static find(target: PolymorphicEntityTarget | null): (
        PolymorphicEntityMetadata | undefined
    ) {
        if (target) return Reflect.getOwnMetadata('union-metadata', target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        name: string,
        target: PolymorphicEntityTarget | null,
        sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ): PolymorphicEntityMetadata {
        return this.find(target) ?? this.build(
            name, target, sources
        )
    }

    // ------------------------------------------------------------------------

    public static findOrThrow(target: PolymorphicEntityTarget): (
        PolymorphicEntityMetadata
    ) {
        return this.find(target)! ?? PolyORMException.Metadata.throw(
            "UNKNOWN_ENTITY", target.name
        )
    }
}

export {
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,

    type UnionEntitiesMap,
    type CombinedColumnOptions
}