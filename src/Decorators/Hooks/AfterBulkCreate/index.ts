import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"

export default function AfterBulkCreate<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (entities: Entity[]) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterBulkCreate(propertyName)
}