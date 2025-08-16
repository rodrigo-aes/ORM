import {
    PolymorphicEntityMetadata,
    type CombinedColumnOptions
} from "../../../Metadata"

// Types
import type { PolymorphicEntityTarget } from "../../../../types/General"

export default function Combine(options: CombinedColumnOptions) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        const meta = PolymorphicEntityMetadata.find(target.constructor as (
            PolymorphicEntityTarget
        ))
        if (!meta) throw new Error

        meta.combineColumn(name, options)
    }
}

export {
    type CombinedColumnOptions
}