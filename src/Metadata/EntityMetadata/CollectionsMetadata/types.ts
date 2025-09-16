import type { Collection } from "../../../BaseEntity"

export type CollectionsMetadataJSON = {
    default: typeof Collection
    collections: (typeof Collection)[]
}