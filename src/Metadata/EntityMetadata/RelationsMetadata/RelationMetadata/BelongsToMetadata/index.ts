import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../../types"
import type {
    BelongsToOptions,
    BelongsToRelatedGetter,
    BelongsToMetadataJSON
} from "./types"
import type { RelatedEntitiesMap } from "../types"

export default class BelongsToMetadata extends RelationMetadata {
    public related!: BelongsToRelatedGetter
    public scope?: any

    private foreignKeyName: string

    constructor(
        target: EntityTarget,
        { name, foreignKey, ...options }: BelongsToOptions
    ) {
        super(target, name)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
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

    public get foreignKey(): ColumnMetadata {
        return ColumnsMetadata.findOrBuild(this.target).findOrThrow(
            this.foreignKeyName
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.entity.toJSON(),
                foreignKey: this.foreignKey.toJSON(),
                type: this.type
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'scope'
                ]
                    .includes(key)
            )
        ]) as BelongsToMetadataJSON
    }

    // Protecteds -------------------------------------------------------------
    protected getEntities() {
        const related = this.related()

        if (Array.isArray(related)) {
            const entitiesMap: RelatedEntitiesMap = {}
            for (const rel of related) entitiesMap[rel.name] = this.getEntity(
                rel
            )

            return entitiesMap
        }

        else return this.getEntity(related)
    }

    // Privates ---------------------------------------------------------------
    private getEntity(target: EntityTarget) {
        return EntityMetadata.find(target)!
    }
}

export type {
    BelongsToOptions,
    BelongsToRelatedGetter,
    BelongsToMetadataJSON
}