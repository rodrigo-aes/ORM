import {
    EntityUnionMetadata,
    type CombinedColumnOptions
} from "../../../Metadata"

// Types
import type { EntityUnionTarget } from "../../../../types/General"

export default function Combine(options: CombinedColumnOptions) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        const meta = EntityUnionMetadata.find(target.constructor as (
            EntityUnionTarget
        ))
        if (!meta) throw new Error

        meta.combineColumn(name, options)
    }
}

export {
    type CombinedColumnOptions
}