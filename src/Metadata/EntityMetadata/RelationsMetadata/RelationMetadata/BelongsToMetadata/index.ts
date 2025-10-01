import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { EntityTarget, Target } from "../../../../../types"
import type {
    BelongsToOptions,
    BelongsToRelatedGetter,
    BelongsToMetadataJSON
} from "./types"
import type { RelatedEntitiesMap } from "../types"

export default class BelongsToMetadata extends RelationMetadata {
    public related!: BelongsToRelatedGetter
    public scope?: any

    public FKName: string

    constructor(
        target: Target,
        { name, foreignKey, ...options }: BelongsToOptions
    ) {
        super(target, name)
        Object.assign(this, options)

        this.FKName = foreignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return this.getEntity(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedPK(): string {
        return this.relatedMetadata.columns.primary.name
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return ColumnsMetadata.findOrBuild(this.target).findOrThrow(
            this.FKName
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.relatedMetadata.toJSON(),
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