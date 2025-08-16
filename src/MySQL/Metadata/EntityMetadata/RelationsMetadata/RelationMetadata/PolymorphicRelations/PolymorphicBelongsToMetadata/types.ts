import type { RelationMetadataJSON } from "../../types"
import type { EntityMetadataJSON } from "../../../../types"
import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata/ColumnMetadata"
import type { RelatedEntitiesMap } from "../../types"

export interface PolymorphicBelongsToMetadataJSON
    extends RelationMetadataJSON {
    entities: RelatedEntitiesMap
    foreignKey: ColumnMetadataJSON
    typeColumn?: ColumnMetadataJSON
    scope?: any
}