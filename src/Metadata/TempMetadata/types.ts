import type EntityMetadata from "../EntityMetadata"
import type { ScopeMetadata } from "../EntityMetadata"
import type PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"
import type { Collection, Pagination } from "../../BaseEntity"

export type TempMetadataValue = {
    metadata?: EntityMetadata | PolymorphicEntityMetadata,
    scope?: ScopeMetadata
    collection?: typeof Collection,
    pagination?: typeof Pagination
}