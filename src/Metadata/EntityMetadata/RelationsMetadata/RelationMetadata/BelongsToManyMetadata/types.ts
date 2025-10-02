import type { RelationOptions, RelationMetadataJSON } from "../types"
import type { EntityTarget } from "../../../../../types"
import type { ForeignKeyActionListener } from "../../../ColumnsMetadata"
import type { EntityMetadataJSON } from "../../../types"
import type { JoinTableMetadataJSON } from "../../../JoinTablesMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type BelongsToManyRelatedGetter = () => EntityTarget

export interface BelongsToManyOptions extends RelationOptions {
    related: BelongsToManyRelatedGetter
    joinTable?: string
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: ConditionalQueryOptions<any>
}

export interface BelongsToManyMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    joinTable: JoinTableMetadataJSON
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: ConditionalQueryOptions<any>
}