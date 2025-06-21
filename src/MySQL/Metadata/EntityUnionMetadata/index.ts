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
import type { SourcesMetadata, EntityUnionMetadataJSON } from "./types"

export default class EntityUnionMetadata {
    public connection?: MySQLConnection
    public sourceMetadata!: SourcesMetadata

    private _columns!: UnionColumnsMetadata
    private _relations?: UnionRelationsMetadata

    constructor(
        public tableName: string,
        public target: UnionEntityTarget | null,
        public sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
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

    private loadSourcesMetadata(): void {
        try {
            if (typeof this.sources === 'function') (
                this.sources = this.sources()
            )

            this.sourceMetadata = Object.fromEntries(this.sources.map(
                source => [source.name, EntityMetadata.findOrBuild(source)]
            ))

        } catch (error) {
            this.sourceMetadata = {}
        }
    }

    // ------------------------------------------------------------------------

    private loadColumns(): UnionColumnsMetadata {
        const metas = Object.values(this.sourceMetadata)

        this._columns = new UnionColumnsMetadata(
            this.target,
            metas.flatMap(meta => [...meta.columns])
        )

        return this._columns
    }

    // ------------------------------------------------------------------------

    private loadRelations(): UnionRelationsMetadata | undefined {
        const metas = Object.values(this.sourceMetadata)
        const relations = metas.flatMap(meta => [...meta.relations ?? []])

        if (relations.length > 0) this._relations = new UnionRelationsMetadata(
            this.target,
            ...relations
        )

        return this._relations
    }

    // ------------------------------------------------------------------------

    private buildJSON<T extends EntityTarget = any>(): (
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

    public static find(origin: UnionEntityTarget | string): (
        EntityUnionMetadata | undefined
    ) {
        const isString = typeof origin === 'string'

        return Reflect.getOwnMetadata(
            isString ? origin : 'union-metadata',
            isString ? EntityUnionMetadata : origin
        )
    }

    // ------------------------------------------------------------------------

    public static findOrBuild(
        name: string,
        target: UnionEntityTarget | null,
        sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ): EntityUnionMetadata {
        return this.find(target ?? name) ?? this.build(
            name, target, sources
        )
    }
}

export {
    UnionColumnsMetadata,
    UnionColumnMetadata
}