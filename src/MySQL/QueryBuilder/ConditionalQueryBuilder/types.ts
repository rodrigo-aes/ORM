import type { EntityTarget } from "../../../types/General"

import type { AndQueryOptions } from "./AndSQLBuilder"
import type { OrQueryOptions } from "./OrSQLBuilder"

export type ConditionalQueryOptions<Entity extends object> = (
    AndQueryOptions<Entity> |
    OrQueryOptions<Entity>

)

export type {
    AndQueryOptions,
    OrQueryOptions
}