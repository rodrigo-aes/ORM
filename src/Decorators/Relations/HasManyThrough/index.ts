import {
    RelationsMetadata,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter
} from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"
import type { HasManyThroughOptions } from "./types"

export default function HasManyThrough(
    related: HasManyThroughRelatedGetter,
    through: HasManyThroughGetter,
    options: HasManyThroughOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasManyThrough({ name, related, through, ...options })
    }
}

export type {
    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter
}