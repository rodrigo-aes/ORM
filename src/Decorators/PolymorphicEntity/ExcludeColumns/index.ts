import { PolymorphicEntityMetadata } from "../../../Metadata"

// Types
import type { PolymorphicEntityTarget } from "../../../types/General"

export default function ExcludeColumns(...names: string[]) {
    return function (target: PolymorphicEntityTarget) {
        const meta = PolymorphicEntityMetadata.find(target)
        if (!meta) throw new Error

        meta.excludeColumns(...names)
    }
}