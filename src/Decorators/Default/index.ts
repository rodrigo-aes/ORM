import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget } from "../../types"

export default function Default<Entity extends object>(value: any) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .set(name, { defaultValue: value })
    }
}