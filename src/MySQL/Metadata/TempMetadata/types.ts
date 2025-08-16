import type EntityMetadata from "../EntityMetadata"
import type EntityUnionMetadata from "../EntityUnionMetadata"
import type { FindQueryOptions } from "../../Repository"
import type { Collection } from "../../BaseEntity"

export type TempMetadataValue = {
    metadata?: EntityMetadata | EntityUnionMetadata,
    scope?: FindQueryOptions<any>
    collection?: typeof Collection
}