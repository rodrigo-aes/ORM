import type { FindQueryOptions } from "../FindQueryBuilder"

export type FindOneQueryOptions<Entity extends object> = Omit<
    FindQueryOptions<Entity>, (
        'limit' |
        'offset'
    )
>