import { TriggersMetadata } from "../../Metadata"

// Types
import type { EntityTarget, Constructor } from "../../types"
import type { Trigger } from "../../Triggers"

export default function Triggers<
    T extends EntityTarget,
    Triggers extends Constructor<Trigger<InstanceType<T>>>[]
>(...triggers: Triggers) {
    return function (target: T) {
        TriggersMetadata.findOrBuild(target, ...triggers)
    }
}