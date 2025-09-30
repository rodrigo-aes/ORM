import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget } from "../../types"
import type { ForeignKeyReferencedGetter } from "../../Metadata"
import type { ForeignKeyConstraintOptions } from "./types"

export default function ForeignKey(
    referenced: ForeignKeyReferencedGetter,
    constrained: boolean | ForeignKeyConstraintOptions = true
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        if (typeof constrained === 'boolean') constrained = { constrained }

        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .defineForeignKey(name, { referenced, ...constrained })
    }
}

export type {
    ForeignKeyReferencedGetter,
    ForeignKeyConstraintOptions
}