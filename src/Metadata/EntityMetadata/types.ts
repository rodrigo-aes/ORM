import type { EntityTarget } from "../../types"
import type { ColumnsMetadataJSON } from "./ColumnsMetadata"
import type { RelationsMetadataJSON } from "./RelationsMetadata"
import type { JoinTableMetadataJSON } from "./JoinTablesMetadata/JoinTableMetadata"
import type { HooksMetadataJSON } from "./HooksMetadata"
import type { ComputedPropertiesJSON } from "./ComputedPropertiesMetadata"
import type { CollectionsMetadataJSON } from "./CollectionsMetadata"
import type { ScopesMetadataJSON } from "./ScopesMetadata"
import type Repository from "../../Repository"
import type { Trigger } from "../../Triggers"

export type EntityMetadataJSON<T extends EntityTarget = any> = {
    target: T
    name: string
    tableName: string
    columns: ColumnsMetadataJSON<T>
    relations?: RelationsMetadataJSON
    joinTables?: JoinTableMetadataJSON[]
    Repository: typeof Repository<T>
    hooks?: HooksMetadataJSON
    scopes?: ScopesMetadataJSON
    computedProperties?: ComputedPropertiesJSON
    triggers?: (typeof Trigger)[]
    collections?: CollectionsMetadataJSON
    paginations?: CollectionsMetadataJSON
}