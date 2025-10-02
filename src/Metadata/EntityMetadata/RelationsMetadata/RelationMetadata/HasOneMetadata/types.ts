import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type HasOneRelatedGetter = () => EntityTarget

export interface HasOneOptions extends RelationOptions {
    foreignKey: string
    related: HasOneRelatedGetter
    scope?: ConditionalQueryOptions<any>
}

export interface HasOneMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}