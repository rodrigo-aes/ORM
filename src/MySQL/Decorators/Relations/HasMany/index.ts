import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../../types/General"
import type { HasManyRelatedGetter } from "../../../Metadata"
import type { RelationOptions } from "./types"

export default function HasMany(
    related: HasManyRelatedGetter,
    foreignKey: RelationOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        if (typeof foreignKey === 'string') foreignKey = { foreignKey }

        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasMany({ name, related, ...foreignKey })
    }
}