import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { ConditionalQueryOptions } from "../../../QueryBuilder"

export default function BeforeBulkDelete<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        where: ConditionalQueryOptions<Entity>
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeBulkDelete(propertyName)
}