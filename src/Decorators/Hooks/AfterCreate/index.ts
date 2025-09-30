import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types"

export default function AfterCreate<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(entity: Entity) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterCreate(propertyName)
}