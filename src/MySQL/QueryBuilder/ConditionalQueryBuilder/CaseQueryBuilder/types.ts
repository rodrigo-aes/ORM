import type { EntityPropertiesKeys } from "../../types"
import type { CompatibleOperators } from "../Operator"
import type { ConditionalQueryOptions } from "../types"

export type EntityWhenQueryOptions<Entity extends object> = Partial<{
    [K in EntityPropertiesKeys<Entity>]: (
        Entity[K] |
        Partial<CompatibleOperators<Entity[K]>>
    )
}>

export type RelationWhenQueryOptions = {
    [K: string]: any | Partial<CompatibleOperators<any>>
}

export type WhenQueryOption<Entity extends object> = (
    ConditionalQueryOptions<Entity>
)

export type ThenQueryOption = any
export type ElseQueryOption = any | undefined

export type CaseQueryTuple<Entity extends object> = [
    WhenQueryOption<Entity>,
    ThenQueryOption
]

export type CaseQueryOptions<Entity extends object> = [
    ...CaseQueryTuple<Entity>[],
    ElseQueryOption
]