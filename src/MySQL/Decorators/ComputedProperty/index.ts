import {
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction
} from "../../Metadata"

// Types
import type {
    EntityTarget,
    EntityUnionTarget,
    CollectionTarget
} from "../../../types/General"

export default function ComputedProperty(fn: ComputedPropertyFunction) {
    return function <Target extends InstanceType<
        EntityTarget | EntityUnionTarget | CollectionTarget
    >>(
        target: Target,
        name: string
    ) {
        ComputedPropertiesMetadata.findOrBuild(target.constructor as (
            EntityTarget | EntityUnionTarget | CollectionTarget
        ))
            .set(name, fn)
    }
}