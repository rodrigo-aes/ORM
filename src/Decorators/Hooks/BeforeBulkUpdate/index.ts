import { HooksMetadata } from "../../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    UpdateAttributes,
    ConditionalQueryOptions
} from "../../../SQLBuilders"

export default function BeforeBulkUpdate<Entity extends object>(
    target: Entity,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        attributes: UpdateAttributes<Entity>,
        where?: ConditionalQueryOptions<Entity>
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeBulkUpdate(propertyName)
}