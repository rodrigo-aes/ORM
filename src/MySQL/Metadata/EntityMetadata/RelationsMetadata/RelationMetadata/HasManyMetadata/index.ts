import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { HasManyOptions, HasManyRelatedGetter } from "./types"

export default class HasManyMetadata extends RelationMetadata {
    public entity: EntityMetadata
    public related!: HasManyRelatedGetter
    public scope?: any

    private foreignKeyName: string

    constructor(
        target: EntityTarget,
        { foreignKey, ...options }: HasManyOptions
    ) {
        super(target, options)
        Object.assign(this, options)

        this.entity = this.loadEntity()
        this.foreignKeyName = foreignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
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
    HasManyOptions,
    HasManyRelatedGetter
}