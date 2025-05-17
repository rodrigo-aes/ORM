import type { AndQueryOptions } from "../AndQueryBuilder"

export type OrQueryOptions<Entity extends object> = AndQueryOptions<
    Entity
>[]