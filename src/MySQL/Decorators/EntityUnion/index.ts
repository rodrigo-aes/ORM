import { EntityUnionMetadata } from "../../Metadata"

// Types
import type { UnionEntityTarget, EntityTarget } from "../../../types/General"

export default function EntityUnion(...entities: EntityTarget[]) {
    return function (target: UnionEntityTarget) {
        EntityUnionMetadata.findOrBuild(
            target.name.toLowerCase(),
            target,
            entities
        )
    }
}