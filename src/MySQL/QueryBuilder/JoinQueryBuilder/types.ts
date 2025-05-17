import type { EntityRelationsKeys } from "../types"
import type { SelectOptions } from "../SelectQueryBuilder"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type WhereQueryBuilder from "../ConditionalQueryBuilder/WhereQueryBuilder"
import { Entity } from "../../Decorators"

export type RelationOptions<Entity extends object> = {
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
    on: WhereQueryBuilder<any>
}

export type EntityRelationsMap<Entity extends object> = {
    [K in EntityRelationsKeys<Entity>]: EntityRelationMap
}