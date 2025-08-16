import { CollectionsMetadata } from "../../Metadata"

// Decorators
import DefaultCollection from "./DefaultCollection"

// Types
import type { EntityTarget, EntityUnionTarget } from "../../../types/General"
import type { Collection } from "../../BaseEntity"

export default function Collections(...collections: (typeof Collection)[]) {
    return function (target: EntityTarget | EntityUnionTarget) {
        CollectionsMetadata.findOrBuild(target).addCollections(
            ...collections
        )
    }
}

export {
    DefaultCollection
}