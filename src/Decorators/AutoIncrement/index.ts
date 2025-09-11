import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget } from "../../types/General"

export default function AutoIncrement<Entity extends object>(
    autoIncrement: boolean = true
) {
    return function (
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .setColumn(name, { autoIncrement })
    }
}