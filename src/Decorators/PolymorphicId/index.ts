import { ColumnsMetadata } from "../../Metadata"

// Types
import type { EntityTarget } from "../../types"

export default function PolymorphicId<Entity extends object>(
    target: Entity,
    name: string
) {
    ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
        .registerColumnPattern(name, 'polymorphic-id')
}