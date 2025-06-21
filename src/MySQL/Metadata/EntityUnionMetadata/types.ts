import type { UnionEntityTarget } from "../../../types/General"
import type EntityMetadata from "../EntityMetadata"
import type { ColumnsMetadataJSON, RelationsMetadataJSON } from "../EntityMetadata"

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