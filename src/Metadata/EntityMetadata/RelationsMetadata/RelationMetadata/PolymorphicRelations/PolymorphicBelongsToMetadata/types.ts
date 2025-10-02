import type {
    RelationMetadataJSON,
    RelatedEntitiesMapJSON
} from "../../types"

import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../../PolymorphicEntityMetadata"

import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'

export interface PolymorphicBelongsToMetadataJSON
    extends RelationMetadataJSON {
    related: PolymorphicEntityMetadataJSON | RelatedEntitiesMapJSON
    foreignKey: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    typeColumn?: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}