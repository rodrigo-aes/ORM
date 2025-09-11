import type { EntityTarget } from "../../../../../types/General"
import type { RelationOptions } from "../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata/ColumnMetadata"

export type BelongsToThroughRelatedGetter = () => EntityTarget
export type BelongsToThroughGetter = () => EntityTarget

export interface BelongsToThroughOptions extends RelationOptions {
    related: BelongsToThroughRelatedGetter,
    through: BelongsToThroughGetter
    foreignKey: string
    throughForeignKey: string
    scope?: any
}

export type ThroughForeignKeysMap = {
    [key: string]: ColumnMetadata
}

export interface BelongsToThroughMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    throughEntity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    throughForeignKey: ColumnMetadataJSON
}