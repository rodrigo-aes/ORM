import {
    ColumnsMetadata,
    type PolymorphicTypeKeyRelateds
} from "../../Metadata"

// Types
import type { EntityTarget } from "../../types/General"

export default function PolymorphicTypeKey(
    relateds: PolymorphicTypeKeyRelateds
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumnPattern(name, 'polymorphic-type-key', relateds)
    }
}