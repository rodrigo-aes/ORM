import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../../types/General"
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
        { foreignKey, throughForeignKey, ...options }: BelongsToThroughOptions
    ) {
        super(target, options)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.throughForeignKeyName = throughForeignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata {
        return this.getEntity(this.related())
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
        return this.getEntity(this.through())
    }

    // ------------------------------------------------------------------------

    public get throughEntityName(): string {
        return this.throughEntity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.getEntity(this.target).getColumn(this.foreignKeyName)
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughEntity.getColumn(
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

    // Privates ---------------------------------------------------------------
    private getEntity(target: EntityTarget) {
        return EntityMetadata.find(target)!
    }
}

export type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    BelongsToThroughMetadataJSON
}