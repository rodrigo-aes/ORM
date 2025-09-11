import {
    RelationsMetadata,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter
} from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"
import type { RelationOptions } from "./types"

export default function BelongsToThrough(
    related: BelongsToThroughRelatedGetter,
    through: BelongsToThroughGetter,
    options: RelationOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addBelongsToThrough({ name, related, through, ...options })
    }
}