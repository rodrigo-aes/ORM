import type { EntityUnionTarget, EntityTarget } from "../../../types/General"
import type EntityMetadata from "../EntityMetadata"
import type { ColumnsMetadataJSON, RelationsMetadataJSON } from "../EntityMetadata"

export type UnionEntitiesMap = {
    [K: string]: EntityTarget
}


export type SourcesMetadata = {
    [K: string]: EntityMetadata
}

export type PolymorphicEntityMetadataJSON = {
    target: EntityUnionTarget
    name: string
    tableName: string
    columns: ColumnsMetadataJSON
    relations?: RelationsMetadataJSON
}