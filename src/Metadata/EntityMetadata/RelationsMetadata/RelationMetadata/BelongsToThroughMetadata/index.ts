import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { Target, EntityTarget } from "../../../../../types"
import type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    BelongsToThroughMetadataJSON
} from "./types"

export default class BelongsToThroughMetadata extends RelationMetadata {
    public related!: BelongsToThroughRelatedGetter
    public through!: BelongsToThroughGetter

    public relatedFKName: string
    private _throughFKName: string

    constructor(
        target: Target,
        { name, foreignKey, throughForeignKey, ...options }: (
            BelongsToThroughOptions
        )
    ) {
        super(target, name)
        Object.assign(this, options)

        this.relatedFKName = foreignKey
        this._throughFKName = throughForeignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): ColumnMetadata {
        return EntityMetadata.findOrThrow(this.target)
            .columns
            .findOrThrow(this.relatedFKName)
    }

    // ------------------------------------------------------------------------

    public get throughMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.through())
    }

    // ------------------------------------------------------------------------

    public get throughAlias(): string {
        return `__through${this.throughMetadata.target.name.toLowerCase()}`
    }

    // ------------------------------------------------------------------------

    public get throughTable(): string {
        return `${this.throughMetadata.tableName} ${this.throughAlias}`
    }

    // ------------------------------------------------------------------------

    public get throughPrimary(): string {
        return (
            `${this.throughAlias}.${this.throughMetadata.columns.primary.name}`
        )
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughMetadata
            .columns
            .findOrThrow(this._throughFKName)
    }

    // ------------------------------------------------------------------------

    public get throughFKName(): string {
        return `${this.throughAlias}.${this.throughForeignKey.name}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToThroughMetadataJSON {
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
        ]) as BelongsToThroughMetadataJSON
    }
}

export type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    BelongsToThroughMetadataJSON
}