import type { EntityTarget } from "../../types/General"
import type { ColumnsMetadataJSON } from "./ColumnsMetadata"
import type { RelationsMetadataJSON } from "./RelationsMetadata"
import type { JoinTableMetadataJSON } from "./JoinTableMetadata"

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
}