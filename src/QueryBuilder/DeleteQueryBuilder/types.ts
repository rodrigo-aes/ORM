import type { EntityTarget } from "../../types"
import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: ConditionalQueryBuilder<T>) => void
)
