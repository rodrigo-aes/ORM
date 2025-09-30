import type { PolymorphicEntityTarget, EntityTarget } from "../../types"
import type EntityMetadata from "../EntityMetadata"
import type {
    ColumnsMetadataJSON,
    RelationsMetadataJSON,
    HooksMetadataJSON,
    ScopesMetadataJSON,
    ComputedPropertiesJSON,
    CollectionsMetadataJSON,
} from "../EntityMetadata"

import type PolymorphicRepository from "../../PolymorphicRepository"
import type { Trigger } from "../../Triggers"

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
    repository: typeof PolymorphicRepository
    hooks?: HooksMetadataJSON
    scopes?: ScopesMetadataJSON
    computedProperties?: ComputedPropertiesJSON
    collections?: CollectionsMetadataJSON
    paginations?: CollectionsMetadataJSON
}