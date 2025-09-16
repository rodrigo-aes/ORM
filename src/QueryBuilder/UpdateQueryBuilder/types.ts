import type { EntityTarget } from "../../types/General"
import type ConditionalQueryHandler from "../ConditionalQueryBuilder"

export type WhereQueryFunction<T extends EntityTarget> = (
    (queryBuilder: ConditionalQueryHandler<T>) => void
)
