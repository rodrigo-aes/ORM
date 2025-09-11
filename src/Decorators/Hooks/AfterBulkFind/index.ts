import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"

export default function AfterBulkFind<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (entities: Entity[]) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterBulkFind(propertyName)
}