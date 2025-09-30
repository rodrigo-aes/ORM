import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types"
import type { CreationAttributes } from "../../../SQLBuilders"

export default function BeforeCreate<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (options: CreationAttributes<Entity>) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeCreate(propertyName)
}