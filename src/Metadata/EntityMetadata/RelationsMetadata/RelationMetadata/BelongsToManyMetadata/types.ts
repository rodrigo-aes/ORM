import type { RelationOptions, RelationMetadataJSON } from "../types"
import type { EntityTarget } from "../../../../../types/General"
import type { ForeignKeyActionListener } from "../../../ColumnsMetadata"
import type { EntityMetadataJSON } from "../../../types"

export type BelongsToManyRelatedGetter = () => EntityTarget

export interface BelongsToManyOptions extends RelationOptions {
    related: BelongsToManyRelatedGetter
    joinTable?: string
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
}

export interface BelongsToManyMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    // joinTable
    // Implement this...
}