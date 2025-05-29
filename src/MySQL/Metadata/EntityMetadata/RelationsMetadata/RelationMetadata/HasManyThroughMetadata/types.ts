import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../../types/General"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata/ColumnMetadata"

export type HasManyThroughRelatedGetter = () => EntityTarget
export type HasManyThroughGetter = () => EntityTarget

export interface HasManyThroughOptions extends RelationOptions {
    foreignKey: string
    throughForeignKey: string
    related: HasManyThroughRelatedGetter
    through: HasManyThroughGetter
    scope?: any
}

export interface HasManyThroughMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    throughEntity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    throughForeignKey: ColumnMetadataJSON
}