import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { PolymorphicParentRelatedGetter } from "../../../../Metadata"
import type { PolymorphicBelongsToOptions } from "./types"

export default function PolymorphicBelongsTo(
    related: PolymorphicParentRelatedGetter,
    options: PolymorphicBelongsToOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicBelongsTo({ name, related, ...options })
    }
}

export type {
    PolymorphicBelongsToOptions
}