import { CollectionsMetadata } from "../../Metadata"

// Decorators
import DefaultCollection from "./DefaultCollection"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../../types/General"
import type { Collection } from "../../BaseEntity"

export default function Collections(...collections: (typeof Collection)[]) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        CollectionsMetadata.findOrBuild(target).addCollections(
            ...collections
        )
    }
}

export {
    DefaultCollection
}