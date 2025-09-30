import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata/ColumnMetadata"

export type BelongsToRelatedGetter = () => EntityTarget

export interface BelongsToOptions extends RelationOptions {
    related: BelongsToRelatedGetter
    foreignKey: string
    scope?: any
}

export interface BelongsToMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    scope?: any
}