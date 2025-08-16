import { PolymorphicEntityMetadata } from "../../../Metadata"

// Types
import type { EntityUnionTarget } from "../../../../types/General"

export default function ExcludeColumns(...names: string[]) {
    return function (target: EntityUnionTarget) {
        const meta = PolymorphicEntityMetadata.find(target)
        if (!meta) throw new Error

        meta.excludeColumns(...names)
    }
}