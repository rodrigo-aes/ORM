import type { RelationMetadataJSON } from "../../types"
import type { EntityMetadataJSON } from "../../../../types"
import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata/ColumnMetadata"

export interface PolymorphicHasOneMetadataJSON extends RelationMetadataJSON {
    entity: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    typeColumn: ColumnMetadataJSON
    scope?: any
}