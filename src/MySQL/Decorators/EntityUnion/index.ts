import { EntityUnionMetadata } from "../../Metadata"

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