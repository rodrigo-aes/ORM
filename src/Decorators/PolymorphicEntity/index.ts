import { PolymorphicEntityMetadata } from "../../Metadata"

// Decorators
import Column, { type IncludeColumnOptions } from "./Column"

import PolymorphicRelation, {
    type IncludePolymorphicRelationOptions
} from "./PolymorphicRelation"

import CommonRelation, {
    type IncludedCommonRelationOptions
} from "./CommonRelation"

// Types
import type { PolymorphicEntityTarget, EntityTarget } from "../../types"

export default function PolymorphicEntity(...entities: EntityTarget[]) {
    return function (target: PolymorphicEntityTarget) {
        PolymorphicEntityMetadata.findOrBuild(
            target,
            target.name.toLowerCase(),
            entities
        )
    }
}

export {
    Column,
    PolymorphicRelation,
    CommonRelation,

    type IncludeColumnOptions,
    type IncludePolymorphicRelationOptions,
    type IncludedCommonRelationOptions,
}