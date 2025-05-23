import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter
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
        { foreignKey, throughForeignKey, ...options }: HasOneThroughOptions
    ) {
        super(target, options)
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
        return this.entity.getColumn(this.foreignKeyName)
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughEntity.getColumn(this.throughForeigKeyName)
    }

    // Instance Methods =======================================================
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
    HasOneThroughGetter
}