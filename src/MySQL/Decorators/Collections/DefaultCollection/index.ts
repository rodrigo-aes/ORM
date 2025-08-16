import { CollectionsMetadata } from "../../../Metadata"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../../types/General"
import type { Collection } from "../../../BaseEntity"

export default function DefaultCollection(collection: typeof Collection) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        CollectionsMetadata.findOrBuild(target).setDefault(collection)
    }
}