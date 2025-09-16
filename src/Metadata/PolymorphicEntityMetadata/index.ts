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

// Handlers
import { PolymorphicEntityBuilder } from "../../Handlers"
import { EntityToJSONProcessMetadata } from "../ProcessMetadata"

// Types
import type MySQLConnection from "../../Connection"
import type { PolymorphicEntityTarget, EntityTarget } from "../../types/General"
import type {
    UnionEntitiesMap,
    SourcesMetadata,
    PolymorphicEntityMetadataJSON
} from "./types"
import PolymorphicRepository from "../../PolymorphicRepository"

export default class PolymorphicEntityMetadata {
    public connection?: MySQLConnection

    private _entities!: UnionEntitiesMap
    private _sourcesMetadata!: SourcesMetadata

    private _columns?: PolymorphicColumnsMetadata
    private _relations?: PolymorphicRelationsMetadata

    public repository!: typeof PolymorphicRepository<any>

    public hooks?: HooksMetadata
    public scopes?: ScopesMetadata

    public exclude?: string[] = []
    public combined?: CombinedColumns

    public computedProperties?: ComputedPropertiesMetadata
    public collections?: CollectionsMetadata
    public paginations?: PaginationsMetadata

    constructor(
        public tableName: string,
        public target: PolymorphicEntityTarget | null,
        public sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        this.loadEntities()
        this.loadSourcesMetadata()
        this.loadColumns()
        this.loadRelations()

        if (this.target) {
            this.hooks = HooksMetadata.find(this.target)
            this.scopes = ScopesMetadata.find(this.target)
            this.computedProperties = ComputedPropertiesMetadata.find(
                this.target
            )
            this.collections = CollectionsMetadata.find(this.target)
            this.paginations = PaginationsMetadata.find(this.target)

            this.loadCombined()
            this.mergeCombined()
        }

        this.register()
        this.loadRepository()

    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target!.name
    }

    // ------------------------------------------------------------------------

    public get targetName(): string {
        return this.target?.name.toLowerCase() ?? this.tableName
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

    public get relations(): PolymorphicRelationsMetadata | undefined {
        return this._relations ?? this.loadRelations()
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
    public defineConnection(connection: MySQLConnection) {
        this.connection = connection
    }

    // ------------------------------------------------------------------------

    public defineRepository(repository: typeof PolymorphicRepository<any>): (
        void
    ) {
        this.repository = repository
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
        if (!this.combined) this.combined = {}
        this.combined[name] = options
    }

    // ------------------------------------------------------------------------

    public excludeColumns(...columnNames: string[]): void {
        this.exclude = columnNames
    }

    // Privates ---------------------------------------------------------------
    private register(): void {
        if (!this.target) this.target = this.registerInternalEntity()

        Reflect.defineMetadata(
            'union-metadata',
            this,
            this.target
        )
    }

    // ------------------------------------------------------------------------

    private registerInternalEntity(): PolymorphicEntityTarget {
        return PolymorphicEntityBuilder.buildInternalEntityUnion(this)
    }

    // ------------------------------------------------------------------------

    private loadEntities(): void {
        try {
            if (typeof this.sources === 'function') (
                this.sources = this.sources()
            )

            this._entities = Object.fromEntries(this.sources.map(
                source => [source.name, source]
            ))

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
            metas.flatMap(meta => [
                ...[...meta.columns].filter(
                    ({ name }) => !this.exclude?.includes(name)
                )
            ])
        )

        return this._columns
    }

    // ------------------------------------------------------------------------

    private loadRepository() {
        this.repository = Reflect.getOwnMetadata(
            'repository', this.target!
        )
            ?? PolymorphicRepository
    }

    // ------------------------------------------------------------------------

    private mergeCombined(): void {
        if (this.combined) this._columns!.combine(this.combined)
    }

    // ------------------------------------------------------------------------

    private loadRelations(): PolymorphicRelationsMetadata | undefined {
        const metas = Object.values(this.sourcesMetadata)
        const relations = metas.flatMap(meta => [...meta.relations ?? []])

        if (relations.length > 0) this._relations = (
            new PolymorphicRelationsMetadata(
                this.target,
                ...relations
            )
        )

        return this._relations
    }

    // ------------------------------------------------------------------------

    private loadCombined() {
        this.combined = Reflect.getOwnMetadata(
            'combined-column',
            this.target!
        )
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
}

export {
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,

    type UnionEntitiesMap,
    type CombinedColumnOptions
}