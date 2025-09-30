import type { EntityTarget } from "../../types"
import type ConditionalQueryHandler from "../ConditionalQueryBuilder"

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: ConditionalQueryHandler<T>) => void
)
