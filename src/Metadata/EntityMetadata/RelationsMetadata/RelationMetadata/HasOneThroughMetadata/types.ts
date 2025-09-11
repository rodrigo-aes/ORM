import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types/General"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata/ColumnMetadata"

export type HasOneThroughRelatedGetter = () => EntityTarget
export type HasOneThroughGetter = () => EntityTarget

export interface HasOneThroughOptions extends RelationOptions {
    foreignKey: string
    throughForeignKey: string
    related: HasOneThroughRelatedGetter
    through: HasOneThroughGetter
    scope?: any
}

export interface HasOneThroughMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    throughEntity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    throughForeignKey: ColumnMetadataJSON
}