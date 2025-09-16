import type { EntityTarget } from "../../types/General"
import type { ColumnsMetadataJSON } from "./ColumnsMetadata"
import type { RelationsMetadataJSON } from "./RelationsMetadata"
import type { JoinTableMetadataJSON } from "./JoinTableMetadata"
import type { HooksMetadataJSON } from "./HooksMetadata"
import type { ComputedPropertiesJSON } from "./ComputedPropertiesMetadata"
import type { CollectionsMetadataJSON } from "./CollectionsMetadata"
import type { ScopesMetadataJSON } from "./ScopesMetadata"
import type Repository from "../../Repository"
import type { Trigger } from "../../Triggers"


export type EntityMetadataInitMap = {
    tableName?: string
}

export type EntityMetadataJSON<T extends EntityTarget = any> = {
    target: T
    name: string
    tableName: string
    columns: ColumnsMetadataJSON<T>
    relations?: RelationsMetadataJSON
    joinTables?: JoinTableMetadataJSON[]
    repository: typeof Repository<T>
    hooks?: HooksMetadataJSON
    scopes?: ScopesMetadataJSON
    computedProperties?: ComputedPropertiesJSON
    triggers?: (typeof Trigger)[]
    collections?: CollectionsMetadataJSON
    paginations?: CollectionsMetadataJSON
}