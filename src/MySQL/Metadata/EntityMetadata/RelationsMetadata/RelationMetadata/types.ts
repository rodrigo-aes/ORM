import type EntityMetadata from "../.."

import type RelationMetadata from "./RelationMetadata"
import type HasOneMetadata from "./HasOneMetadata"
import type HasManyMetadata from './HasManyMetadata'
import type HasOneThroughMetadata from "./HasOneThroughMetadata"
import type HasManyThroughMetadata from "./HasManyThroughMetadata"
import type BelongsToMetadata from "./BelongsToMetadata"
import type BelongsToThroughMetadata from "./BelongsToThroughMetadata"
import type BelongsToManyMetadata from "./BelongsToManyMetadata"
import type {
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    PolymorphicHasOneMetadataJSON,
    PolymorphicHasManyMetadataJSON,
    PolymorphicBelongsToMetadataJSON
} from './PolymorphicRelations'

import type { HasOneMetadataJSON } from "./HasOneMetadata"
import type { HasManyMetadataJSON } from "./HasManyMetadata"
import type { HasOneThroughMetadataJSON } from "./HasOneThroughMetadata"
import type { HasManyThroughMetadataJSON } from "./HasManyThroughMetadata"
import type { BelongsToMetadataJSON } from "./BelongsToMetadata"
import type { BelongsToThroughMetadataJSON } from "./BelongsToThroughMetadata"
import type { BelongsToManyMetadataJSON } from "./BelongsToManyMetadata"

export interface RelationOptions {
    name: string
}

export type RelatedEntitiesMap = {
    [key: string]: EntityMetadata
}

export type RelationMetadataType = (
    RelationMetadata |
    HasOneMetadata |
    HasManyMetadata |
    HasOneThroughMetadata |
    HasManyThroughMetadata |
    BelongsToMetadata |
    BelongsToThroughMetadata |
    BelongsToManyMetadata |
    PolymorphicHasOneMetadata |
    PolymorphicHasManyMetadata |
    PolymorphicBelongsToMetadata
)

export type OneRelationMetadataType = Omit<RelationMetadataType, (
    'HasManyMetadata' |
    'HasManyThroughMetadata' |
    'BelongsToManyMetadata' |
    'PolymorphicHasManyMetadata'
)>

export type ManyRelationMetadatatype = Omit<RelationMetadataType, (
    'HasOneMetadata' |
    'HasOneThroughMetadata' |
    'BelongsToMetadata' |
    'BelongsToThroughMetadata' |
    'PolymorphicHasOneMetadata' |
    'PolymorphicBelongsToMetadata'
)>

export type RelationMetadataName = (
    'HasOne' |
    'HasMany' |
    'HasOneThrough' |
    'HasManyThrough' |
    'BelongsTo' |
    'BelongsToThrough' |
    'BelongsToMany' |
    'PolymorphicHasOne' |
    'PolymorphicHasMany' |
    'PolymorphicBelongsTo'
)

export type RelationMetadataJSON = {
    name: string,
    type: RelationMetadataName
}

export type RelationJSON = (
    PolymorphicHasOneMetadataJSON |
    PolymorphicHasManyMetadataJSON |
    PolymorphicBelongsToMetadataJSON |
    HasOneMetadataJSON |
    HasManyMetadataJSON |
    HasOneThroughMetadataJSON |
    HasManyThroughMetadataJSON |
    BelongsToMetadataJSON |
    BelongsToThroughMetadataJSON |
    BelongsToManyMetadataJSON
)