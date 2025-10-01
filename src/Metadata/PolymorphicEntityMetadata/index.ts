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

    type IncludedColumns,
    type IncludeColumnOptions
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
        private _sources: EntityTarget[] | PolymorphicParentRelatedGetter
    ) {
        if (!target && !tablename) throw new Error(
            'Polymorphic metadata needs a PolymorphicEntityTarget or tablename'
        )
        super()

        this.tableName = tablename ?? target!.name.toLocaleLowerCase()
        this.target = target ?? (
            PolymorphicEntityBuilder.buildInternalPolymorphicEntity(this)
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target?.name ?? this.tableName
            .split('_')
            .map(word => (
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ))
            .join('')
    }

    // ------------------------------------------------------------------------

    public get sources(): EntityTarget[] {
        return this._sources = typeof this._sources === 'function'
            ? this._sources()
            : this._sources
    }

    // ------------------------------------------------------------------------

    public get connection(): PolyORMConnection {
        return MetadataHandler.getConnection(this.target)
    }

    // ------------------------------------------------------------------------

    public get entities(): UnionEntitiesMap {
        return this._entities = this._entities ?? Object.fromEntries(
            this.sources.map(target => [target.name, target])
        )
    }

    // ------------------------------------------------------------------------

    public get sourcesMetadata(): SourcesMetadata {
        return this._sourcesMetadata = this._sourcesMetadata
            ?? Object.fromEntries(this.sources.map(target => [
                target.name, EntityMetadata.findOrThrow(target)
            ]))
    }

    // ------------------------------------------------------------------------

    public get columns(): PolymorphicColumnsMetadata {
        return PolymorphicColumnsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get relations(): PolymorphicRelationsMetadata {
        throw new Error
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

    // Privates ---------------------------------------------------------------

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
    type IncludedColumns,
    type IncludeColumnOptions
}