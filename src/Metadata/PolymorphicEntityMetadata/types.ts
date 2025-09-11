import type { PolymorphicEntityTarget, EntityTarget } from "../../types/General"
import type EntityMetadata from "../EntityMetadata"
import type { ColumnsMetadataJSON, RelationsMetadataJSON } from "../EntityMetadata"

export type UnionEntitiesMap = {
    [K: string]: EntityTarget
}


export type SourcesMetadata = {
    [K: string]: EntityMetadata
}

export type PolymorphicEntityMetadataJSON = {
    target: PolymorphicEntityTarget
    name: string
    tableName: string
    columns: ColumnsMetadataJSON
    relations?: RelationsMetadataJSON
}