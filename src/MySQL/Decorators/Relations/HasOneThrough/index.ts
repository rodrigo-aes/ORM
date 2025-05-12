import {
    RelationsMetadata,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter
} from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { RelationOptions } from "./types"

export default function HasOneThrough(
    related: HasOneThroughRelatedGetter,
    through: HasOneThroughGetter,
    options: RelationOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasOneThrough({ name, related, through, ...options })
    }
}