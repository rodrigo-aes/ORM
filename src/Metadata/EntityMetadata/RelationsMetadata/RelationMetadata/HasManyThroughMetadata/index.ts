import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { Target, EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter,
    HasManyThroughMetadataJSON
} from "./types"

export default class HasManyThroughMetadata extends RelationMetadata {
    public relatedMetadata: EntityMetadata
    public throughMetadata: EntityMetadata

    public related!: HasManyThroughRelatedGetter
    public through!: HasManyThroughGetter

    public relatedFKName: string
    private _throughFKName: string

    public scope: any

    constructor(
        target: Target,
        { name, foreignKey, throughForeignKey, ...options }: HasManyThroughOptions
    ) {
        super(target, name)
        Object.assign(this, options)

        this.relatedFKName = foreignKey
        this._throughFKName = throughForeignKey
        this.relatedMetadata = this.loadEntity()
        this.throughMetadata = this.loadThroughEntity()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.relatedFKName)
    }

    // ------------------------------------------------------------------------

    public get throughTable(): string {
        return `${this.throughMetadata.tableName} ${this.throughAlias}`
    }

    // ------------------------------------------------------------------------

    public get throughAlias(): string {
        return `__through${this.throughMetadata.target.name.toLowerCase()}`
    }

    // ------------------------------------------------------------------------

    public get throughPrimary(): string {
        return (
            `${this.throughAlias}.${this.throughMetadata.columns.primary.name}`
        )
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughMetadata.columns.findOrThrow(
            this._throughFKName
        )
    }

    // ------------------------------------------------------------------------

    public get throughFKName(): string {
        return `${this.throughAlias}.${this.throughForeignKey.name}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasManyThroughMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.relatedMetadata.toJSON(),
                throughEntity: this.throughMetadata.toJSON(),
                foreignKey: this.relatedForeignKey.toJSON(),
                throughForeignKey: this.throughForeignKey.toJSON(),
                type: this.type
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name'
                ]
                    .includes(key)
            )
        ]) as HasManyThroughMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private loadEntity() {
        return EntityMetadata.findOrBuild(this.related())
    }

    // ------------------------------------------------------------------------

    private loadThroughEntity() {
        return EntityMetadata.findOrBuild(this.through())
    }
}

export type {
    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter,
    HasManyThroughMetadataJSON
}