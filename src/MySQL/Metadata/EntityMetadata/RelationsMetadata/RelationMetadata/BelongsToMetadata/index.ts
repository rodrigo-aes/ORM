import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type { BelongToOptions, BelongsToRelatedGetter } from "./types"
import type { RelatedEntitiesMap } from "../types"

export default class BelongsToMetadata extends RelationMetadata {
    public related!: BelongsToRelatedGetter
    public scope?: any

    private foreignKeyName: string

    constructor(
        target: EntityTarget,
        { foreignKey, ...options }: BelongToOptions
    ) {
        super(target, options)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata | RelatedEntitiesMap {
        return this.getEntities()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return ColumnsMetadata.findOrBuild(this.target).getColumn(
            this.foreignKeyName
        )
    }

    // Instance Methods =======================================================
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
    BelongToOptions,
    BelongsToRelatedGetter
}