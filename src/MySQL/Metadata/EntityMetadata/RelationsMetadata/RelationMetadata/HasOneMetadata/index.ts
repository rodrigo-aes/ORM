import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { HasOneOptions, HasOneRelatedGetter } from "./types"

export default class HasOneMetadata extends RelationMetadata {
    public entity: EntityMetadata
    public related!: HasOneRelatedGetter
    public scope?: any

    private foreignKeyName: string

    constructor(
        target: EntityTarget,
        { foreignKey, ...options }: HasOneOptions
    ) {
        super(target, options)
        Object.assign(this, options)

        this.entity = this.loadEntity()
        this.foreignKeyName = foreignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entityName(): string {
        return this.entity.constructor.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.entity.getColumn(this.foreignKeyName)
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private loadEntity() {
        return EntityMetadata.findOrBuild(this.related())
    }
}

export type {
    HasOneOptions,
    HasOneRelatedGetter
}