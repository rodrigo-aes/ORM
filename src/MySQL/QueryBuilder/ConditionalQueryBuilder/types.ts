import type { EntityTarget } from "../../../types/General"

import type { AndQueryOptions } from "./AndQueryBuilder"
import type { OrQueryOptions } from "./OrQueryBuilder"

export type ConditionalQueryOptions<Entity extends object> = (
    AndQueryOptions<Entity> |
    OrQueryOptions<Entity>

)

export type {
    AndQueryOptions,
    OrQueryOptions
}