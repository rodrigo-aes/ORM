import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter,
    HasManyThroughMetadataJSON
} from "./types"

export default class HasManyThroughMetadata extends RelationMetadata {
    public entity: EntityMetadata
    public throughEntity: EntityMetadata

    public related!: HasManyThroughRelatedGetter
    public through!: HasManyThroughGetter

    private foreignKeyName: string
    private throughForeignKeyName: string

    public scope: any

    constructor(
        target: EntityTarget,
        { foreignKey, throughForeignKey, ...options }: HasManyThroughOptions
    ) {
        super(target, options)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.throughForeignKeyName = throughForeignKey
        this.entity = this.loadEntity()
        this.throughEntity = this.loadThroughEntity()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entityName(): string {
        return this.entity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get throughEntityName(): string {
        return this.throughEntity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.entity.getColumn(this.foreignKeyName)
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughEntity.getColumn(this.throughForeignKeyName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasManyThroughMetadataJSON {
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