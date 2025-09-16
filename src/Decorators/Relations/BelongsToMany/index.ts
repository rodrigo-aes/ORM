import {
    RelationsMetadata,
    type BelongsToManyRelatedGetter
} from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"
import type { BelongsToManyOptions } from "./types"

export default function BelongsToMany(
    related: BelongsToManyRelatedGetter,
    options?: BelongsToManyOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addBelongsToMany({ related, name, ...options })
    }
}

export type {
    BelongsToManyOptions,
    BelongsToManyRelatedGetter
}