import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types"
import type { DeleteResult } from "../../../Handlers"

export default function AfterDelete<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        entity: Entity,
        result: DeleteResult
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterDelete(propertyName)
}