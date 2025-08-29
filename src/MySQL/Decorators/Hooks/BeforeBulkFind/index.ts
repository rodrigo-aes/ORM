import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { FindQueryOptions } from "../../../SQLBuilders"

export default function BeforeBulkFind<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (options: FindQueryOptions<Entity>) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeBulkFind(propertyName)
}