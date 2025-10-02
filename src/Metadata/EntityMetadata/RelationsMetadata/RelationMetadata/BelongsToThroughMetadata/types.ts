import type { EntityTarget } from "../../../../../types"
import type { RelationOptions } from "../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type BelongsToThroughRelatedGetter = () => EntityTarget
export type BelongsToThroughGetter = () => EntityTarget

export interface BelongsToThroughOptions extends RelationOptions {
    related: BelongsToThroughRelatedGetter,
    through: BelongsToThroughGetter
    foreignKey: string
    throughForeignKey: string
    scope?: ConditionalQueryOptions<any>
}

export type ThroughForeignKeysMap = {
    [key: string]: ColumnMetadata
}

export interface BelongsToThroughMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    through: EntityMetadataJSON
    relatedForeignKey: ColumnMetadataJSON
    throughForeignKey: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}