import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { EntityTarget } from "../../../../../types/General"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { RelationOptions } from "./types"

export default function PolymorphicHasMany(
    related: PolymorphicChildRelatedGetter,
    options: RelationOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicHasMany({ name, related, ...options })
    }
}