import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import ColumnsMetadata, {
    type ColumnMetadata
} from "../../../ColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    ThroughForeignKeysMap
} from "./types"
import type { RelatedEntitiesMap } from "../types"

export default class BelongsToThroughMetadata extends RelationMetadata {
    public related!: BelongsToThroughRelatedGetter
    public through!: BelongsToThroughGetter

    private foreignKeyName: string
    private throughForeignKeyName: string

    constructor(
        target: EntityTarget,
        { foreignKey, throughForeignKey, ...options }: BelongsToThroughOptions
    ) {
        super(target, options)
        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.throughForeignKeyName = throughForeignKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata | RelatedEntitiesMap {
        return this.getEntities('related')
    }

    // ------------------------------------------------------------------------

    public get throughEntity(): EntityMetadata | RelatedEntitiesMap {
        return this.getEntities('through')
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return ColumnsMetadata.findOrBuild(this.target).getColumn(
            this.foreignKeyName
        )
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata | ThroughForeignKeysMap {
        const entity = this.throughEntity

        if (entity instanceof EntityMetadata) return entity.columns.getColumn(
            this.throughForeignKeyName
        )

        else {
            const map: ThroughForeignKeysMap = {}

            for (const [name, metadata] of Object.entries(entity)) {
                map[name] = metadata.columns.getColumn(
                    this.throughForeignKeyName
                )
            }

            return map
        }
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private getEntities(source: 'related' | 'through') {
        const related = this[source]()

        if (Array.isArray(related)) {
            const entitiesMap: RelatedEntitiesMap = {}
            for (const rel of related) entitiesMap[rel.name] = this.getEntity(
                rel
            )

            return entitiesMap
        }

        else return this.getEntity(related)
    }

    // ------------------------------------------------------------------------

    private getEntity(target: EntityTarget) {
        return EntityMetadata.find(target)!
    }
}

export type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
}