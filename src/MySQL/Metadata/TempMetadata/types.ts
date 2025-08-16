import type EntityMetadata from "../EntityMetadata"
import type PolymorphicEntityMetadata from "../PolymorphicEntityMetadata"
import type { FindQueryOptions } from "../../Repository"
import type { Collection } from "../../BaseEntity"

export type TempMetadataValue = {
    metadata?: EntityMetadata | PolymorphicEntityMetadata,
    scope?: FindQueryOptions<any>
    collection?: typeof Collection
}