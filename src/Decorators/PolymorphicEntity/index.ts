import { PolymorphicEntityMetadata } from "../../Metadata"

// Decorators
import ExcludeColumns from "./ExcludeColumns"
import Combine, {
    type CombinedColumnOptions
} from "./Combine"

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
    ExcludeColumns,
    Combine,

    type CombinedColumnOptions
}