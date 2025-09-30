import { PolymorphicEntityMetadata } from "../../../Metadata"

// Types
import type { PolymorphicEntityTarget } from "../../../types"

export default function ExcludeColumns(...names: string[]) {
    return function (target: PolymorphicEntityTarget) {
        PolymorphicEntityMetadata.findOrThrow(target).excludeColumns(...names)
    }
}