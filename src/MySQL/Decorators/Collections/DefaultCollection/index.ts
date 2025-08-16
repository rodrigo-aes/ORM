import { CollectionsMetadata } from "../../../Metadata"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../../types/General"
import type { Collection } from "../../../BaseEntity"

export default function DefaultCollection(collection: typeof Collection) {
    return function (target: EntityTarget | EntityUnionTarget) {
        CollectionsMetadata.findOrBuild(target).setDefault(collection)
    }
}