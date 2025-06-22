import type { UnionEntityTarget, EntityTarget } from "../../../types/General"
import type EntityMetadata from "../EntityMetadata"
import type { ColumnsMetadataJSON, RelationsMetadataJSON } from "../EntityMetadata"

export type UnionEntitiesMap = {
    [K: string]: EntityTarget
}


export type SourcesMetadata = {
    [K: string]: EntityMetadata
}

export type EntityUnionMetadataJSON = {
    target: UnionEntityTarget
    name: string
    tableName: string
    columns: ColumnsMetadataJSON
    relations?: RelationsMetadataJSON
}