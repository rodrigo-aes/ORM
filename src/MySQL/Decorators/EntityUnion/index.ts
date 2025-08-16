import { EntityUnionMetadata } from "../../Metadata"

// Decorators
import ExcludeColumns from "./ExcludeColumns"
import Combine, {
    type CombinedColumnOptions
} from "./Combine"

// Types
import type { EntityUnionTarget, EntityTarget } from "../../../types/General"

export default function EntityUnion(...entities: EntityTarget[]) {
    return function (target: EntityUnionTarget) {
        EntityUnionMetadata.findOrBuild(
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