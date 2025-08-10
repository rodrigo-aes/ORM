import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { ConditionalQueryOptions } from "../../../QueryBuilder"
import type { DeleteResult } from "mongodb"

export default function AfterBulkDelete<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        where: ConditionalQueryOptions<Entity>,
        result: DeleteResult
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterBulkDelete(propertyName)
}