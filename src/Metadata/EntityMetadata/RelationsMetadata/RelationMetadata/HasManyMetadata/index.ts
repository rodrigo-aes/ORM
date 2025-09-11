import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../types/General"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasManyOptions,
    HasManyRelatedGetter,
    HasManyMetadataJSON
} from "./types"

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
    public get entityName(): string {
        return this.entity.constructor.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.entity.getColumn(this.foreignKeyName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasManyMetadataJSON {
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
        ]) as HasManyMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private loadEntity() {
        return EntityMetadata.findOrBuild(this.related())
    }
}

export type {
    HasManyOptions,
    HasManyRelatedGetter,
    HasManyMetadataJSON
}