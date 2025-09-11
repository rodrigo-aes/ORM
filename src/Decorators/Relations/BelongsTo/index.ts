import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../types/General"
import type { BelongsToRelatedGetter } from "../../../Metadata"
import type { RelationOptions } from "./types"

export default function BelongsTo(
    related: BelongsToRelatedGetter,
    foreignKey: string | RelationOptions
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