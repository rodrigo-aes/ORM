import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../../types/General"
import type { HasOneRelatedGetter } from "../../../Metadata"
import type { RelationOptions } from "./types"

export default function HasOne(
    related: HasOneRelatedGetter,
    foreignKey: RelationOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        if (typeof foreignKey === 'string') foreignKey = { foreignKey }

        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasOne({ name, related, ...foreignKey })
    }
}