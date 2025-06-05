import type { EntityRelationsKeys } from "../types"
import type { SelectOptions } from "../SelectSQLBuilder"
import type { ConditionalQueryOptions } from "../ConditionalQueryBuilder"
import type SelectSQLBuilder from "../SelectSQLBuilder"
import type OnSQLBuilder from "../ConditionalQueryBuilder/OnSQLBuilder"

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
    select: SelectSQLBuilder<any>,
    on: OnSQLBuilder<any>,
    relations?: EntityRelationMap
}

export type EntityRelationsMap<Entity extends object> = {
    [K in EntityRelationsKeys<Entity>]: EntityRelationMap
}