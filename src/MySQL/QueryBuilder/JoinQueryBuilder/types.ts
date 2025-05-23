import type { EntityRelationsKeys } from "../types"
import type { SelectOptions } from "../SelectQueryBuilder"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type OnQueryBuilder from "../ConditionalQueryBuilder/OnQueryBuilder"

export type RelationOptions<Entity extends object> = {
    required?: boolean
    select?: SelectOptions<Entity>,
    on?: ConditionalQueryOptions<Entity>,
    relations?: RelationsOptions<Entity>
}

export type RelationsOptions<Entity extends object> = {
    [K in EntityRelationsKeys<Entity>]: (
        boolean |
        RelationOptions<Extract<Entity[K], object>>
    )
}

export type EntityRelationMap = {
    select: SelectQueryBuilder<any>,
    on: OnQueryBuilder<any>,
    relations?: EntityRelationMap
}

export type EntityRelationsMap<Entity extends object> = {
    [K in EntityRelationsKeys<Entity>]: EntityRelationMap
}