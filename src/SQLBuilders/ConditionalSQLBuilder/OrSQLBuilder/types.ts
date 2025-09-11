import type { AndQueryOptions } from "../AndSQLBuilder"

export type OrQueryOptions<Entity extends object> = AndQueryOptions<
    Entity
>[]