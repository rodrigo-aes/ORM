import { PolymorphicEntityMetadata } from "../../Metadata"

// Decorators
import Column, { type IncludeColumnOptions } from "./Column"

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
    Column,
    type IncludeColumnOptions
}