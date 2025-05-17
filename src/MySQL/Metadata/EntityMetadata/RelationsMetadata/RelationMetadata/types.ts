import type EntityMetadata from "../.."

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
} from './PolymorphicRelations'

export interface RelationOptions {
    name: string
}

export type RelatedEntitiesMap = {
    [key: string]: EntityMetadata
}

export type RelationMetadataType = (
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

export type RelationMetadataTypeName = (
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