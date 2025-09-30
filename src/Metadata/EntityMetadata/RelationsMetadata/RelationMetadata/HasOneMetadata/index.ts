import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasOneOptions,
    HasOneRelatedGetter,
    HasOneMetadataJSON
} from "./types"

export default class HasOneMetadata extends RelationMetadata {
    public entity: EntityMetadata
    public related!: HasOneRelatedGetter
    public scope?: any

    private foreignKeyName: string

    constructor(
        target: EntityTarget,
        { name, foreignKey, ...options }: HasOneOptions
    ) {
        super(target, name)
        Object.assign(this, options)

        this.entity = this.loadEntity()
        this.foreignKeyName = foreignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get entityName(): string {
        return this.entity.constructor.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.entity.columns.findOrThrow(this.foreignKeyName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasOneMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.entity.toJSON(),
                foreignKey: this.foreignKey.toJSON(),
                type: this.type
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'scope',
                ]
                    .includes(key)
            )
        ]) as HasOneMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private loadEntity() {
        return EntityMetadata.findOrBuild(this.related())
    }
}

export type {
    HasOneOptions,
    HasOneRelatedGetter,
    HasOneMetadataJSON
}