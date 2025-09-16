import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget } from "../../types/General"
import type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
} from "./types"

export default function PolymorphicForeignId(
    referenced: PolymorphicForeignIdRelatedGetter,
    options?: PolymorphicForeignIdOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumnPattern(name, 'polymorphic-foreign-id', {
                referenced, ...options
            })
    }
}

export type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
}