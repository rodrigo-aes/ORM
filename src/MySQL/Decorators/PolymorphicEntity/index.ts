import { PolymorphicEntityMetadata } from "../../Metadata"

// Decorators
import ExcludeColumns from "./ExcludeColumns"
import Combine, {
    type CombinedColumnOptions
} from "./Combine"

// Types
import type { EntityUnionTarget, EntityTarget } from "../../../types/General"

export default function PolymorphicEntity(...entities: EntityTarget[]) {
    return function (target: EntityUnionTarget) {
        PolymorphicEntityMetadata.findOrBuild(
            target.name.toLowerCase(),
            target,
            entities
        )
    }
}

export {
    ExcludeColumns,
    Combine,

    type CombinedColumnOptions
}