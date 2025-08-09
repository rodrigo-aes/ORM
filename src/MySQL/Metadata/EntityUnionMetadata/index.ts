import EntityMetadata, {
    type PolymorphicParentRelatedGetter,
} from "../EntityMetadata"

import UnionColumnsMetadata, {
    UnionColumnMetadata
} from "./UnionColumnsMetadata"

import UnionRelationsMetadata from "./UnionRelationsMetadata"

// Handlers
import { EntityUnionBuilder } from "../../Handlers"
import { EntityToJSONProcessMetadata } from "../ProcessMetadata"

// Types
import type MySQLConnection from "../../Connection"
import type { UnionEntityTarget, EntityTarget } from "../../../types/General"
import type {
    UnionEntitiesMap,
    SourcesMetadata,
    EntityUnionMetadataJSON
} from "./types"

export default class EntityUnionMetadata {
    public connection?: MySQLConnection

    private _entities!: UnionEntitiesMap
    private _sourcesMetadata!: SourcesMetadata

    private _columns!: UnionColumnsMetadata
    private _relations?: UnionRelationsMetadata

    constructor(
        public tableName: string,
        public target: UnionEntityTarget | null,
        public sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        this.loadEntities()
        this.loadSourcesMetadata()
        this.loadColumns()
        this.loadRelations()
        this.register()
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

    public get columns(): UnionColumnsMetadata {
        if (typeof this.sources === 'function') this.loadSourcesMetadata()
        return this.loadColumns()
    }

    // ------------------------------------------------------------------------

    public get relations(): UnionRelationsMetadata | undefined {
        return this.loadRelations()
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): UnionColumnMetadata[] {
        return this.columns.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): UnionColumnMetadata[] {
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

    public toJSON(): (
        EntityUnionMetadataJSON | undefined
    ) {
        return EntityToJSONProcessMetadata.initialized
            ? this.buildJSON()
            : EntityToJSONProcessMetadata.apply(
                () => this.buildJSON()
            )
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

    private registerInternalEntity(): UnionEntityTarget {
        return EntityUnionBuilder.buildInternalEntityUnion(this)
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

    private loadColumns(): UnionColumnsMetadata {
        const metas = Object.values(this.sourcesMetadata)

        this._columns = new UnionColumnsMetadata(
            this.target,
            metas.flatMap(meta => [...meta.columns])
        )

        return this._columns
    }

    // ------------------------------------------------------------------------

    private loadRelations(): UnionRelationsMetadata | undefined {
        const metas = Object.values(this.sourcesMetadata)
        const relations = metas.flatMap(meta => [...meta.relations ?? []])

        if (relations.length > 0) this._relations = new UnionRelationsMetadata(
            this.target,
            ...relations
        )

        return this._relations
    }

    // ------------------------------------------------------------------------

    private buildJSON<T extends UnionEntityTarget = any>(): (
        EntityUnionMetadataJSON | undefined
    ) {
        return EntityToJSONProcessMetadata.shouldAdd(this.name)
            ? {
                target: this.target as T,
                name: this.name,
                tableName: this.tableName,
                columns: this.columns.toJSON(),
                relations: this.relations?.toJSON(),
                // joinTables: this.joinTables?.map(table => table.toJSON())
            }
            : undefined
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build(
        name: string,
        target: UnionEntityTarget | null,
        sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        return new EntityUnionMetadata(
            name,
            target,
            sources
        )
    }

    // ------------------------------------------------------------------------

    public static find(target: UnionEntityTarget | null): (
        EntityUnionMetadata | undefined
    ) {
        if (target) return Reflect.getOwnMetadata('union-metadata', target)
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        name: string,
        target: UnionEntityTarget | null,
        sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ): EntityUnionMetadata {
        return this.find(target) ?? this.build(
            name, target, sources
        )
    }
}

export {
    UnionColumnsMetadata,
    UnionColumnMetadata,
    type UnionEntitiesMap
}