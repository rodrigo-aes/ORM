import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget } from "../../types"

export default function AutoIncrement<Entity extends object>(
    autoIncrement: boolean = true
) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .set(name, { autoIncrement })
    }
}