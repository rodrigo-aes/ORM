import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasOneOptions } from "./types"

export default function PolymorphicHasOne(
    related: PolymorphicChildRelatedGetter,
    options: PolymorphicHasOneOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicHasOne({ name, related, ...options })
    }
}

export type {
    PolymorphicHasOneOptions
}