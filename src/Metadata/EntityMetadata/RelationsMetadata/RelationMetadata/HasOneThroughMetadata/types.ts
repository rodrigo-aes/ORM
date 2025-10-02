import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type HasOneThroughRelatedGetter = () => EntityTarget
export type HasOneThroughGetter = () => EntityTarget

export interface HasOneThroughOptions extends RelationOptions {
    foreignKey: string
    throughForeignKey: string
    related: HasOneThroughRelatedGetter
    through: HasOneThroughGetter
    scope?: ConditionalQueryOptions<any>
}

export interface HasOneThroughMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    through: EntityMetadataJSON
    relatedForeignKey: ColumnMetadataJSON
    throughForeignKey: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}