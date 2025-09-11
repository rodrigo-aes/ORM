import { FindQueryOptions } from "../FindSQLBuilder"

export interface PaginationQueryOptions<
    Entity extends object
> extends Omit<FindQueryOptions<Entity>, 'limit' | 'offset'> {
    page?: number
    perPage?: number
}