import {
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction
} from "../../Metadata"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget,
    CollectionTarget
} from "../../types/General"

export default function ComputedProperty(fn: ComputedPropertyFunction) {
    return function <Target extends InstanceType<
        EntityTarget | PolymorphicEntityTarget | CollectionTarget
    >>(
        target: Target,
        name: string
    ) {
        ComputedPropertiesMetadata.findOrBuild(target.constructor as (
            EntityTarget | PolymorphicEntityTarget | CollectionTarget
        ))
            .set(name, fn)
    }
}

export type {
    ComputedPropertyFunction
}