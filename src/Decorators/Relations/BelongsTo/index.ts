import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../types"
import type { BelongsToRelatedGetter } from "../../../Metadata"
import type { BelongToOptions } from "./types"

export default function BelongsTo(
    related: BelongsToRelatedGetter,
    foreignKey: string | BelongToOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        if (typeof foreignKey === 'string') foreignKey = { foreignKey }

        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addBelongsTo({ name, related, ...foreignKey })
    }
}

export type {
    BelongToOptions,
    BelongsToRelatedGetter
}