import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { PolymorphicParentRelatedGetter } from "../../../../Metadata"
import type { RelationOptions } from "./types"

export default function PolymorphicBelongsTo(
    related: PolymorphicParentRelatedGetter,
    options: RelationOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicBelongsTo({ name, related, ...options })
    }
}