import type { RelationMetadataJSON } from "../../types"
import type { EntityMetadataJSON } from "../../../../types"
import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'

export interface PolymorphicHasOneMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    typeColumn?: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}