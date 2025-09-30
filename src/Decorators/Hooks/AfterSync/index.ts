import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types"

export default function AfterSync<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<() => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterSync(propertyName)
}