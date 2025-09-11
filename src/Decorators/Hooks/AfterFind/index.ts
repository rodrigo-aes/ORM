import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"

export default function AfterFind<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (entity: Entity) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterFind(propertyName)
}