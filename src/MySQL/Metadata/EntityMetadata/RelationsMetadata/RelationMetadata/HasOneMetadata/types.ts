import type { RelationOptions } from "../types"
import type { EntityTarget } from "../../../../../../types/General"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata/ColumnMetadata"

export type HasOneRelatedGetter = () => EntityTarget

export interface HasOneOptions extends RelationOptions {
    foreignKey: string
    related: HasOneRelatedGetter
    scope?: any
}

export interface HasOneMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    scope?: any
}