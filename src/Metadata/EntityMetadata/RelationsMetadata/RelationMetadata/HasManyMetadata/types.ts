import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../types"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata/ColumnMetadata"

export type HasManyRelatedGetter = () => EntityTarget

export interface HasManyOptions extends RelationOptions {
    foreignKey: string
    related: HasManyRelatedGetter
    scope?: any
}

export interface HasManyMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    scope?: any
}