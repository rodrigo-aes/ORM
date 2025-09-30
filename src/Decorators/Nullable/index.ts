import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget } from "../../types"

export default function Nullable<Entity extends object>(
    nullable: boolean = true
) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .set(name, { nullable })
    }
}