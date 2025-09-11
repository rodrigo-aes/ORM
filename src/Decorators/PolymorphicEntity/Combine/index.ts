import {
    PolymorphicEntityMetadata,
    type CombinedColumnOptions
} from "../../../Metadata"

// Types
import type { PolymorphicEntityTarget } from "../../../types/General"

export default function Combine(options: CombinedColumnOptions) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        Reflect.defineMetadata(
            'combined-columns',
            {
                ...Reflect.getOwnMetadata('combined-columns', target),
                [name]: options
            },
            target
        )
    }
}

export {
    type CombinedColumnOptions
}