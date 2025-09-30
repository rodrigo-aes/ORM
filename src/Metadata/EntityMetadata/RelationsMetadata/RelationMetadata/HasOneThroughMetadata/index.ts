import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter,
    HasOneThroughMetadataJSON
} from "./types"

export default class HasOneThroughMetadata extends RelationMetadata {
    public entity: EntityMetadata
    public throughEntity: EntityMetadata

    public related!: HasOneThroughRelatedGetter
    public through!: HasOneThroughGetter

    public foreignKeyName: string
    public throughForeigKeyName: string

    public scope: any

    constructor(
        target: EntityTarget,
        { name, foreignKey, throughForeignKey, ...options }: HasOneThroughOptions
    ) {
        super(target, name)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.throughForeigKeyName = throughForeignKey
        this.entity = this.loadEntity()
        this.throughEntity = this.loadThroughEntity()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get entityName(): string {
        return this.entity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get throughEntityName(): string {
        return this.throughEntity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.entity.columns.findOrThrow(this.foreignKeyName)
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughEntity.columns.findOrThrow(this.throughForeigKeyName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasOneThroughMetadataJSON {
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
        ]) as HasOneThroughMetadataJSON
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
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter,
    HasOneThroughMetadataJSON
}