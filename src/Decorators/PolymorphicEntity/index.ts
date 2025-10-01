import { PolymorphicEntityMetadata } from "../../Metadata"

// Decorators
import IncludeColumn, { type IncludeColumnOptions } from "./Include"

// Types
import type { PolymorphicEntityTarget, EntityTarget } from "../../types"

export default function PolymorphicEntity(...entities: EntityTarget[]) {
    return function (target: PolymorphicEntityTarget) {
        PolymorphicEntityMetadata.findOrBuild(
            target,
            target.name.toLowerCase(),
            entities
        )
    }
}

export {
    IncludeColumn,
    type IncludeColumnOptions
}