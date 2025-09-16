import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget } from "../../types/General"
import type { ForeignIdRelatedGetter, ForeignIdOptions } from "./types"

export default function ForeignId(
    referenced: ForeignIdRelatedGetter,
    options?: ForeignIdOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumnPattern(name, 'foreign-id', {
                referenced, ...options
            })
    }
}

export type {
    ForeignIdRelatedGetter,
    ForeignIdOptions
}