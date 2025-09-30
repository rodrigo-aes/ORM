import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget } from "../../types"

export default function Primary<Entity extends object>(
    primary: boolean = true
) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .set(name, { primary })

    }
}