import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { CreationAttributes } from "../../../QueryBuilder"

export default function BeforeBulkCreate<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (options: CreationAttributes<Entity>[]) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeBulkCreate(propertyName)
}