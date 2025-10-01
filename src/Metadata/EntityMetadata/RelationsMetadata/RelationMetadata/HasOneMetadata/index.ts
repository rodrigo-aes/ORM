import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { Target, EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    HasOneOptions,
    HasOneRelatedGetter,
    HasOneMetadataJSON
} from "./types"

export default class HasOneMetadata extends RelationMetadata {
    public relatedMetadata: EntityMetadata
    public related!: HasOneRelatedGetter
    public scope?: any

    public relatedFKName: string

    constructor(
        target: Target,
        { name, foreignKey, ...options }: HasOneOptions
    ) {
        super(target, name)
        Object.assign(this, options)

        this.relatedMetadata = this.loadEntity()
        this.relatedFKName = foreignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedName(): string {
        return this.relatedMetadata.constructor.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.relatedFKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasOneMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.relatedMetadata.toJSON(),
                foreignKey: this.relatedForeignKey.toJSON(),
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