import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../../types"
import type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    BelongsToThroughMetadataJSON
} from "./types"

export default class BelongsToThroughMetadata extends RelationMetadata {
    public related!: BelongsToThroughRelatedGetter
    public through!: BelongsToThroughGetter

    private foreignKeyName: string
    private throughForeignKeyName: string

    constructor(
        target: EntityTarget,
        { name, foreignKey, throughForeignKey, ...options }: (
            BelongsToThroughOptions
        )
    ) {
        super(target, name)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.throughForeignKeyName = throughForeignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get entityName(): string {
        return this.entity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get throughEntity(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.through())
    }

    // ------------------------------------------------------------------------

    public get throughEntityName(): string {
        return this.throughEntity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return EntityMetadata.findOrThrow(this.target).columns.findOrThrow(
            this.foreignKeyName
        )
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughEntity.columns.findOrThrow(
            this.throughForeignKeyName
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToThroughMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.entity.toJSON(),
                throughEntity: this.throughEntity.toJSON(),
                foreignKey: this.foreignKey.toJSON(),
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