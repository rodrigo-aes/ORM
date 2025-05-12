import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget } from "../../../types/General"

export default function Default<Entity extends object>(value: any) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .setColumn(name, { defaultValue: value })
    }
}