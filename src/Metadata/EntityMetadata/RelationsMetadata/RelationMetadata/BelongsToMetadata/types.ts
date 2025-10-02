import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type BelongsToRelatedGetter = () => EntityTarget

export interface BelongsToOptions extends RelationOptions {
    related: BelongsToRelatedGetter
    foreignKey: string
    scope?: ConditionalQueryOptions<any>
}

export interface BelongsToMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}